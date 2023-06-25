import { ObjectMapper, JsonParser } from "jackson-js";
//import { Flight } from "../Models/Flight";
import { hotelOffer, hotelInfos, testClass } from "../Models/hotelOffer";

// router.js
const { API_KEY, API_SECRET, SENDGRID_API_KEY } = require("../config");
const Amadeus = require("amadeus");
const express = require("express");
var _ = require("underscore");
//const path = require("path");
var bodyParser = require("body-parser");
var jp = require('jsonpath');

var app = express();
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create router
const router = express.Router();
//For production
const amadeus = new Amadeus({
  clientId: API_KEY,
  clientSecret: API_SECRET,
  hostname: 'production'
});

const objectMapper = new ObjectMapper();

//for test env
// const amadeus = new Amadeus({
//   clientId: API_KEY,
//   clientSecret: API_SECRET
// });

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);


interface IAmadeusHotelRepo {
  getHotelOffers(destination: string, checkInDate: string, checkOutDate: string, adults: string): Promise<hotelOffer[]>;
}

export class AmadeusHotelMockRepo implements IAmadeusHotelRepo {
  async getHotelOffers(destination: string, checkInDate: string, checkOutDate: string, adults: string): Promise<hotelOffer[]> {
    let hotels: Array<hotelOffer> = [
      // { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
      //  { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    ];
    return hotels;
  }
}

export class AmadeusHotelRepo implements IAmadeusHotelRepo {
  async getHotelOffers(destination: string, checkInDate: string, checkOutDate: string, rooms: string): Promise<hotelOffer[]> {

    return amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: destination
    }).then(async function (hotelsList: any) {

      let offersforAHotel;
      let results;
      results = new Array<hotelOffer>();
      let pricingResp;
      let resultOffers;
      let resultHotelInfos;
      let hotelOffersParsed;
      let hotelInfoParsed;
      ///////////////////go through each hotel and process offers.
      for (var i = 0; i < 2; i++) {

        pricingResp = await amadeus.shopping.hotelOffersSearch.get({
          'hotelIds': hotelsList.data[i].hotelId,
          'adults': rooms,
          'checkInDate': checkInDate,
          'checkOutDate': checkOutDate
        });

        if (pricingResp.data.length > 0) {
          resultOffers = JSON.stringify(pricingResp.data[0].offers);
          resultHotelInfos = JSON.stringify(pricingResp.data[0].hotel)

          hotelOffersParsed = objectMapper.parse<hotelOffer[]>(resultOffers, { mainCreator: () => [Array, [hotelOffer]] });

          hotelInfoParsed = objectMapper.parse<hotelInfos>(resultHotelInfos, { mainCreator: () => [hotelInfos] });
          hotelOffersParsed[0].hotelInfos_ = hotelInfoParsed;
          for (var j = 0; j < hotelOffersParsed.length; j++) {
            hotelOffersParsed[j].original = JSON.stringify(pricingResp.data[0].offers[j]); //JSON.stringify([JsonFlights][i]);
            hotelOffersParsed[j].hotelInfos_ = hotelInfoParsed;
            results.push(hotelOffersParsed[j]);

          }
        }
      }// close for loop
      return results;
    }).catch(function (error: any) {
      throw error;
    });

  }
}