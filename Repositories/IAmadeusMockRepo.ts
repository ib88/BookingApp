//import { FlightInfo } from "Repositories/IFlightInfo";

import { ObjectMapper } from "jackson-js";
//import { Flight } from "../Models/Flight";
import { FlightOffer } from "../Models/FlightOffer";

// router.js
const { API_KEY, API_SECRET } = require("../config");
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
// Create Amadeus API client
const amadeus = new Amadeus({
  clientId: API_KEY,
  clientSecret: API_SECRET,
});

interface IAmadeusRepo {
  getCheapestFlightDates(source: string, destination: string): Promise<flightInfo[]>;
  getFlightAvailability(source: string, destination: string, departureDate: string, adults: string): Promise<flightInfo[]>;
  getFlightOffer(source: string, destination: string, departureDate: string, adults: string, maxFlights: string): Promise<FlightOffer[]>;
  getAirline(source: string): Promise<airlineInfo>;
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
  // async getFlights(): Promise<Flight[]> {
  //   let jsonStr = `[{
  //     "type": "flight-offer",
  //     "price": {
  //                 "price": "40"
  //              },
  //     "source": "GDS",
  //     "asdf": "asdf"
  //   },
  //   {
  //     "type": "flight-offer",
  //     "price": "190",
  //     "source": "GDS"
  //   }]`;

  //   const objectMapper = new ObjectMapper();
  //   const flightsParsed = objectMapper.parse<Flight>(jsonStr)
  //   return [flightsParsed];
  // }

  async getCheapestFlightDates(source: string, destination: string): Promise<flightInfo[]> {
    let flights: Array<flightInfo> = [
      // { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
      //  { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    ];
    return flights;
  }

  async getFlightOffer(source: string, destination: string, departureDate: string, adults: string, maxFlights: string): Promise<FlightOffer[]>
  {
    let flights: Array<FlightOffer> = [
      // { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
      //  { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    ];
    return flights;
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
}

export class AmadeusRepo implements IAmadeusRepo {

  async getCheapestFlightDates(source: string, destination: string): Promise<flightInfo[]> {
    let flights: Array<flightInfo> = [
      //x { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
      //{ id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    ];
    return flights;
  }

  async getFlightOffer(source: string, destination: string, departureDate: string, adults: string, maxFlights: string): Promise<FlightOffer[]> {

    return amadeus.shopping.flightOffersSearch.get({
      originLocationCode: source,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: adults,
      max: maxFlights
    }).then(function (response: any) {

      const objectMapper = new ObjectMapper();
      if(!response)
        return null;
      const result = JSON.stringify(response.data);
      //objectMapper.configure();
      const flightsParsed = objectMapper.parse<FlightOffer>(result, { mainCreator: () => [Array, [FlightOffer]] });
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