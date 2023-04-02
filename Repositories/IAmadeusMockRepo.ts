//import { FlightInfo } from "Repositories/IFlightInfo";

import { ObjectMapper } from "jackson-js";
//import { Flight } from "../Models/Flight";
import { FlightOffer } from "../Models/FlightOffer";

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

//app.set('views', path.join(__dirname,"views"));
//app.set("view engine", "ejs");
//app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create router
const router = express.Router();
//Create Amadeus API client
const amadeus = new Amadeus({
  clientId: API_KEY,
  clientSecret: API_SECRET,
  hostname: 'production'
});

// const amadeus = new Amadeus({
//   clientId: API_KEY,
//   clientSecret: API_SECRET
// });

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);


interface IAmadeusRepo {
  getCheapestFlightDates(source: string, destination: string): Promise<flightInfo[]>;
  getFlightAvailability(source: string, destination: string, departureDate: string, adults: string): Promise<flightInfo[]>;
  //getFlightOffer(source: string, destination: string, departureDate: string, returnDate: string, adults: string,children: string, maxFlights: string): Promise<FlightOffer[]>;
  getFlightOffer(source: string, destination: string, departureDate: string, adults: string, children: string, maxFlights: string,returnDate?: string): Promise<FlightOffer[]> ;
  getAirline(source: string): Promise<airlineInfo>;
  bookFlight(pricingResponse: any, firstName: string, lastName: string, birthDate: string, gender: string, email: string): Promise<any>;
  confirmFlight(searchResponse: any): Promise<any>;
  sendEmail(to: string, from: string, subject: string, text: string, html: string): Promise<any>;

}

interface flightInfo {
  id: string
  type: string
  price: string
  departure: string
  arrival: string
  returnDate: string
  source: string
  destination: string
  duration: string
  instantTicketingRequired: boolean
  oneWay: boolean
  lastTicketingDate: string
  nonHomogeneous: boolean
  carrierCode: string
}

export interface airlineInfo {
  iataCode: string
  type: string
  icaoCode: string
  businessName: string
  commonName: string
}

export class AmadeusMockRepo implements IAmadeusRepo {

  async sendEmail(to: string, from: string, subject: string, text: string, html: string): Promise<any> {

    let response: any;
    response = "";
    //x { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    //{ id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    return response;

  }

  async getCheapestFlightDates(source: string, destination: string): Promise<flightInfo[]> {
    let flights: Array<flightInfo> = [
      // { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
      //  { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    ];
    return flights;
  }

  async getFlightOffer(source: string, destination: string, departureDate: string, adults: string, children: string, maxFlights: string,returnDate?: string): Promise<FlightOffer[]> {
    let flights: Array<FlightOffer> = [
      // { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
      //  { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    ];
    return flights;
  }
  async getFlightOfferReturnsUndefined(source: string, destination: string, departureDate: string, adults: string, maxFlights: string): Promise<any> {
    let flights: Array<FlightOffer> = [
      // { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
      //  { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    ];
    return undefined;
  }
  async getFlightOfferReturnsNull(source: string, destination: string, departureDate: string, adults: string, maxFlights: string): Promise<any> {
    let flights: Array<FlightOffer> = [
      // { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
      //  { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    ];
    return undefined;
  }

  async getFlightAvailability(source: string, destination: string, departureDate: string, adults: string): Promise<flightInfo[]> {
    let flights: Array<flightInfo> = [
      //{ id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
      // { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    ];
    return flights;
  }

  async getAirline(code: string): Promise<airlineInfo> {
    let airline: airlineInfo = {
      iataCode: "",
      type: "",
      icaoCode: "",
      businessName: "",
      commonName: ""
    };
    //x { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    //{ id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    return airline;
  }

  async bookFlight(pricingResponse: any, firstName: string, lastName: string, birthDate: string, gender: string, email: string): Promise<any> {
    let response: any;
    response = "";
    //x { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    //{ id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    return response;
  }
  async confirmFlight(searchResponse: any): Promise<any> {
    let response: any;
    response = "";
    //x { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    //{ id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    return response;
  }

}

export class AmadeusRepo implements IAmadeusRepo {


  async sendEmail(to: string, from: string, subject: string, text: string, html: string): Promise<any> {

    let msg = {
      to: to, // Change to your recipient
      from: from, // Change to your verified sender
      subject: subject,
      text: text,
      html: html
    };

    return sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error: any) => {
        throw error;
      });
  }

  async bookFlight(pricingResponse: any, firstName: string, lastName: string, birthDate: string, gender: string, email: string): Promise<any> {

    return amadeus.booking.flightOrders.post(
      JSON.stringify({
        'data': {
          'type': 'flight-order',
          'flightOffers': [pricingResponse.data.flightOffers[0]],
          'travelers': [{
            "id": "1",
            "dateOfBirth": "1982-01-16",
            "name": {
              "firstName": firstName,//"JORGE",
              "lastName": lastName,//"GONZALES"
            },
            "gender": gender,//"MALE",
            "contact": {
              "emailAddress": email,//"jorge.gonzales833@telefonica.es",
              "phones": [{
                "deviceType": "MOBILE",
                "countryCallingCode": "34",
                "number": "480080076"
              }]
            },
            "documents": [{
              "documentType": "PASSPORT",
              "birthPlace": "Madrid",
              "issuanceLocation": "Madrid",
              "issuanceDate": "2015-04-14",
              "number": "00000000",
              "expiryDate": "2025-04-14",
              "issuanceCountry": "ES",
              "validityCountry": "ES",
              "nationality": "ES",
              "holder": true
            }]
          }]
        }
      })
    )
      .then(function (response: any) {
        return response;
      }
      )
      .catch(function (error: any) {
        throw error;
      });

  }

  async confirmFlight(searchResponse: any): Promise<any> {

    return amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify({
        'data': {
          'type': 'flight-offers-pricing',
          'flightOffers': [searchResponse],
        }
      })
    ).then(function (response: any) {
      //console.log("Flight confirmation response:", response.result);
      return response;
      //bookingOffer=response;
      // let bookingResult =  amadeusRepo.bookFlight(response);
      // console.log("Flight Booking response:", bookingResult);

      // res.send(response.result);
    }).catch(function (error: any) {
      //res.send(response)
      throw error;
    });
  }

  async getCheapestFlightDates(source: string, destination: string): Promise<flightInfo[]> {
    let flights: Array<flightInfo> = [
      //x { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
      //{ id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    ];
    return flights;
  }

  async getFlightOffer(source: string, destination: string, departureDate: string, adults: string, children: string, maxFlights: string,returnDate?: string): Promise<FlightOffer[]> {
    if (typeof returnDate !== 'undefined')
    return amadeus.shopping.flightOffersSearch.get({
      originLocationCode: source,
      destinationLocationCode: destination,
      departureDate: departureDate,
      returnDate,
      adults: adults,
      max: maxFlights
    }).then(function (response: any) {

      const objectMapper = new ObjectMapper();
      if (!response)
        return null;
      const result = JSON.stringify(response.data);
      //objectMapper.configure();
      let flightsParsed: FlightOffer[];
      //flightsParsed = new Array<FlightOffer>();
      flightsParsed = objectMapper.parse<FlightOffer[]>(result, { mainCreator: () => [Array, [FlightOffer]] });
      //const JsonFlights = objectMapper.parse<FlightOffer>(result);

      //keep the json version of the object in the original property
      for (var i = 0; i < flightsParsed.length; i++) {
        flightsParsed[i].original = JSON.stringify(response.data[i]); //JSON.stringify([JsonFlights][i]);
      }

      return flightsParsed;
    }).catch(function (error: any) {
      throw error;
    });
    else
    return amadeus.shopping.flightOffersSearch.get({
      originLocationCode: source,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: adults,
      max: maxFlights
    }).then(function (response: any) {

      const objectMapper = new ObjectMapper();
      if (!response)
        return null;
      const result = JSON.stringify(response.data);
      //objectMapper.configure();
      let flightsParsed: FlightOffer[];
      //flightsParsed = new Array<FlightOffer>();
      flightsParsed = objectMapper.parse<FlightOffer[]>(result, { mainCreator: () => [Array, [FlightOffer]] });
      //const JsonFlights = objectMapper.parse<FlightOffer>(result);

      //keep the json version of the object in the original property
      for (var i = 0; i < flightsParsed.length; i++) {
        flightsParsed[i].original = JSON.stringify(response.data[i]); //JSON.stringify([JsonFlights][i]);
      }

      return flightsParsed;
    }).catch(function (error: any) {
      throw error;
    });
  }

  async getFlightAvailability(source: string, destination: string, departureDate: string, adults: string): Promise<flightInfo[]> {
    //try {
    const body = JSON.stringify({
      "originDestinations": [
        {
          "id": "1",
          "originLocationCode": source,
          "destinationLocationCode": destination,
          "departureDateTime": {
            "date": departureDate
          }
        }
      ],
      "travelers": [
        {
          "id": "1",
          "travelerType": "ADULT"
        }
      ],
      "sources": [
        "GDS"
      ]
    });

    return amadeus.shopping.availability.flightAvailabilities.post(body)
      .then(function (response: any) {
        let flightData = response.data; //jp.query(JSON.parse(response.data), "$[*]");
        let dataCount = flightData.length;
        let results: flightInfo[];
        results = new Array<flightInfo>();

        // return response.data.map(
        //   (hotelData: {
        //     id: string,
        //     type: string,
        //     price: string,
        //     departure: string,
        //     destination: string,
        //     zhnvdil: string
        //   }) => {
        //     /*let flight: FlightInfo = {
        //       id: hotelData.id,
        //       type: hotelData.type,
        //       price: '66'
        //     };
        //     return flight;*/
        //     return {
        //       id: hotelData.id
        //     }
        //   });
        //throw new Error;

        for (let i = 0; i < 2; i++) {
          let flight: flightInfo =
          {
            id: flightData[i].id,
            type: flightData[i].type,
            price: '',
            departure: flightData[i].segments[0].departure.at,
            arrival: flightData[i].segments[0].arrival.at,
            returnDate: '',
            source: flightData[i].segments[0].departure.iataCode,
            destination: flightData[i].segments[0].arrival.iataCode,
            duration: flightData[i].duration,
            instantTicketingRequired: flightData[i].instantTicketingRequired,
            oneWay: true,
            lastTicketingDate: '',
            nonHomogeneous: true,
            carrierCode: flightData[i].segments[0].carrierCode
          }

          results.push(flight);
        }// close for loop
        return results;
      }).catch(function (error: any) {
        throw error;
      });
  }

  async getAirline(code: string): Promise<airlineInfo> {

    return amadeus.referenceData.airlines.get({
      airlineCodes: code
    }).then(function (response: any) {

      let airlineData = response.data[0]; //jp.query(JSON.parse(response.data), "$[*]");
      let result: airlineInfo = {
        iataCode: airlineData.iataCode,
        type: airlineData.type,
        icaoCode: airlineData.icaoCode,
        businessName: airlineData.businessName,
        commonName: airlineData.commonName
      };
      return result;
    }).catch(function (error: any) {
      throw error;
    });
  }
}