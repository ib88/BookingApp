<<<<<<< HEAD
import { ObjectMapper,JsonParser } from "jackson-js";
//import { Flight } from "../Models/Flight";
import { hotelOffer,hotelInfos, testClass } from "../Models/hotelOffer";
=======
import { ObjectMapper } from "jackson-js";
//import { Flight } from "../Models/Flight";
import { hotelOffer,hotelInfos } from "../Models/hotelOffer";
>>>>>>> e4b250e3 (finished with the HotelRepo class)

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

<<<<<<< HEAD
=======
//app.set('views', path.join(__dirname,"views"));
//app.set("view engine", "ejs");
//app.use(express.static("public"));

>>>>>>> e4b250e3 (finished with the HotelRepo class)
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

//for test env
// const amadeus = new Amadeus({
//   clientId: API_KEY,
//   clientSecret: API_SECRET
// });

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);


interface IAmadeusHotelRepo {
  getHotelOffers(destination: string, checkInDate:string, checkOutDate:string, adults:string): Promise<hotelOffer[]>;
}

export class AmadeusHotelMockRepo implements IAmadeusHotelRepo {
    async getHotelOffers(destination: string, checkInDate:string, checkOutDate:string, adults: string): Promise<hotelOffer[]> {
        let hotels: Array<hotelOffer> = [
          // { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
          //  { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
        ];
        return hotels;
      }
}

export class AmadeusHotelRepo implements IAmadeusHotelRepo {
    async getHotelOffers(destination: string, checkInDate:string, checkOutDate:string, rooms: string): Promise<hotelOffer[]> {
       
    return amadeus.referenceData.locations.hotels.byCity.get({
        cityCode:destination
    }).then(function (hotelsList:any) {

        return amadeus.shopping.hotelOffersSearch.get({
            'hotelIds': hotelsList.data[5].hotelId,
            'adults' : rooms,
            'checkInDate': checkInDate,
            'checkOutDate': checkOutDate
          });
    }).then(function (pricingResponse:any){


        const objectMapper = new ObjectMapper();
<<<<<<< HEAD
        const jsonParser = new JsonParser();
        if (!pricingResponse)
          return null;
          let resultOffers = undefined;
          let resultHotelInfos = undefined;
          if(pricingResponse.data.length > 0)
          {
            resultOffers = JSON.stringify(pricingResponse.data[0].offers);
            resultHotelInfos = JSON.stringify(pricingResponse.data[0].hotel)
          }
          else
            return null;
        //objectMapper.configure();
        //let hotelOffersParsed: hotelOffer[];
        let hotelOffersParsed:hotelOffer[]|null = null;

        let hotelInfoParsed:hotelInfos;
        //flightsParsed = new Array<FlightOffer>();
        //let resultTest = '[{"name":"ali","age":"12"},{"name":"fran","age":"12"}]';
        //resultOffers = '{"id":"LHBHWKXBO4","checkInDate":"2023-05-30","checkOutDate":"2023-05-31","rateCode":"RAC","rateFamilyEstimated":{"code":"RAC","type":"P"},"commission":{"percentage":"10.00"},"room":{"type":"C1Q","typeEstimated":{"category":"EXECUTIVE_ROOM","beds":1,"bedType":"QUEEN"},"description":{"text":"STANDARD DAILY RATE -PAY LATER \\n1Queen-Shower-2Duvet-30Mb WiFi-Safe Coffee and H2O-Stream HDTV-\\nRobes 30 Mb high speed WiFi on unlimited devices Stream shows to\\nthe HDTV with STREAMPINEAPPLE The Naked Ex…hrobe ","lang":"EN"}},"guests":{"adults":1},"price":{"currency":"USD","total":"231.76","variations":{"average":{"base":"171.90"},"changes":[{"startDate":"2023-05-30","endDate":"2023-05-31","base":"171.90"}]}},"policies":{"cancellations":[{"numberOfNights":1,"deadline":"2023-05-30T16:00:00-07:00"}],"guarantee":{"acceptedPayments":{"creditCards":["AX","DS","CA","VI","UP"],"methods":["CREDIT_CARD"]}},"paymentType":"guarantee"},"self":"https://api.amadeus.com/v3/shopping/hotel-offers/LHBHWKXBO4"}';

        //let testResponse = objectMapper.parse<testClass[]>(resultTest, { mainCreator: () => [Array,[testClass]] });

        hotelOffersParsed = objectMapper.parse<hotelOffer[]>(resultOffers, { mainCreator: () => [Array, [hotelOffer]] });
        //hotelOffersParsed = objectMapper.parse<hotelOffer>(resultOffers, { mainCreator: () => [hotelOffer] });

        //hotelOffersParsed = jsonParser.transform(resultOffers, { mainCreator: () => [hotelOffer] });

        hotelInfoParsed = objectMapper.parse<hotelInfos>(resultHotelInfos, { mainCreator: () => [hotelInfos] });
        hotelOffersParsed[0].hotelInfos_ = hotelInfoParsed;

        //assign the hotel infos object to all the hotel offers. assuming they are all offers of the same hotel.
        // for(var i=0; i<hotelOffersParsed.length; i++)
        // {
        //     hotelOffersParsed[i].hotelInfos_ = hotelInfoParsed;
        // }
=======
        if (!pricingResponse)
          return null;
          let resultOffers = undefined;
          let resultHotelInfos = undefined;
          if(pricingResponse.data.length > 0)
          {
            resultOffers = JSON.stringify(pricingResponse.data[0].offers);
            resultHotelInfos = JSON.stringify(pricingResponse.data[0].hotel)
          }
          else
            return null;
        //objectMapper.configure();
        let hotelOffersParsed: hotelOffer[];
        let hotelInfoParsed:hotelInfos;
        //flightsParsed = new Array<FlightOffer>();
        hotelOffersParsed = objectMapper.parse<hotelOffer[]>(resultOffers, { mainCreator: () => [Array, [hotelOffer]] });
        hotelInfoParsed = objectMapper.parse<hotelInfos>(resultHotelInfos, { mainCreator: () => [hotelInfos] });

        //assign the hotel infos object to all the hotel offers. assuming they are all offers of the same hotel.
        for(var i=0; i<hotelOffersParsed.length; i++)
        {
            hotelOffersParsed[i].hotelInfos_ = hotelInfoParsed;
        }
>>>>>>> e4b250e3 (finished with the HotelRepo class)

          return hotelOffersParsed;
    
      }).catch(function (error: any) {
      throw error;
    });

      }
}