//import { FlightInfo } from "Repositories/IFlightInfo";

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
  getCheapestFlightDates(source: string, destination: string): Promise<FlightInfo[]>;
  getFlightAvailability(source: string, destination: string, departureDate: string): Promise<FlightInfo[]>;
}

interface FlightInfo {
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

export class AmadeusMockRepo implements IAmadeusRepo {

  async getCheapestFlightDates(source: string, destination: string): Promise<FlightInfo[]> {
    let flights: Array<FlightInfo> = [
      // { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
      //  { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    ];
    return flights;
  }

  async getFlightAvailability(source: string, destination: string): Promise<FlightInfo[]> {
    let flights: Array<FlightInfo> = [
      //{ id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
      // { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    ];
    return flights;
  }

}

export class AmadeusRepo implements IAmadeusRepo {

  async getCheapestFlightDates(source: string, destination: string): Promise<FlightInfo[]> {
    let flights: Array<FlightInfo> = [
     //x { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
      //{ id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
    ];
    return flights;
  }

  async getFlightAvailability(source: string, destination: string): Promise<FlightInfo[]> {
    //try {
    const body = JSON.stringify({
      "originDestinations": [
        {
          "id": "1",
          "originLocationCode": "MIA",
          "destinationLocationCode": "ATL",
          "departureDateTime": {
            "date": "2022-11-12"
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
        let results: FlightInfo[];
        results = new Array<FlightInfo>();

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
          let flight: FlightInfo =
          {
            id: flightData[i].id,
            type: flightData[i].type,
            price: '',
            departure: flightData[i].segments[0].departure.at,
            arrival: flightData[i].segments[0].arrival.at,
            returnDate: '',
            source: flightData[i].source,
            destination: '',
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
}