"use strict";
//import { FlightInfo } from "Repositories/IFlightInfo";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmadeusRepo = exports.AmadeusMockRepo = void 0;
const jackson_js_1 = require("jackson-js");
//import { Flight } from "../Models/Flight";
const FlightOffer_1 = require("../Models/FlightOffer");
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
// Create Amadeus API client
// const amadeus = new Amadeus({
//   clientId: API_KEY,
//   clientSecret: API_SECRET,
//   hostname: 'production'
// });
const amadeus = new Amadeus({
    clientId: API_KEY,
    clientSecret: API_SECRET
});
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);
class AmadeusMockRepo {
    sendEmail(to, from, subject, text, html) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            response = "";
            //x { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
            //{ id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
            return response;
        });
    }
    getCheapestFlightDates(source, destination) {
        return __awaiter(this, void 0, void 0, function* () {
            let flights = [
            // { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
            //  { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
            ];
            return flights;
        });
    }
    getFlightOffer(source, destination, departureDate, adults, maxFlights) {
        return __awaiter(this, void 0, void 0, function* () {
            let flights = [
            // { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
            //  { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
            ];
            return flights;
        });
    }
    getFlightAvailability(source, destination, departureDate, adults) {
        return __awaiter(this, void 0, void 0, function* () {
            let flights = [
            //{ id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
            // { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
            ];
            return flights;
        });
    }
    getAirline(code) {
        return __awaiter(this, void 0, void 0, function* () {
            let airline = {
                iataCode: "",
                type: "",
                icaoCode: "",
                businessName: "",
                commonName: ""
            };
            //x { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
            //{ id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
            return airline;
        });
    }
    bookFlight(pricingResponse, firstName, lastName, birthDate, gender, email) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            response = "";
            //x { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
            //{ id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
            return response;
        });
    }
    confirmFlight(searchResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            response = "";
            //x { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
            //{ id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
            return response;
        });
    }
}
exports.AmadeusMockRepo = AmadeusMockRepo;
class AmadeusRepo {
    sendEmail(to, from, subject, text, html) {
        return __awaiter(this, void 0, void 0, function* () {
            let msg = {
                to: to,
                from: from,
                subject: subject,
                text: text,
                html: html
            };
            return sgMail
                .send(msg)
                .then(() => {
                console.log('Email sent');
            })
                .catch((error) => {
                console.error(error);
            });
        });
    }
    bookFlight(pricingResponse, firstName, lastName, birthDate, gender, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return amadeus.booking.flightOrders.post(JSON.stringify({
                'data': {
                    'type': 'flight-order',
                    'flightOffers': [pricingResponse.data.flightOffers[0]],
                    'travelers': [{
                            "id": "1",
                            "dateOfBirth": birthDate,
                            "name": {
                                "firstName": firstName,
                                "lastName": lastName, //"GONZALES"
                            },
                            "gender": gender,
                            "contact": {
                                "emailAddress": email,
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
            }))
                .then(function (response) {
                return response;
            })
                .catch(function (error) {
                throw error;
            });
        });
    }
    confirmFlight(searchResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            return amadeus.shopping.flightOffers.pricing.post(JSON.stringify({
                'data': {
                    'type': 'flight-offers-pricing',
                    'flightOffers': [searchResponse],
                }
            })).then(function (response) {
                //console.log("Flight confirmation response:", response.result);
                return response;
                //bookingOffer=response;
                // let bookingResult =  amadeusRepo.bookFlight(response);
                // console.log("Flight Booking response:", bookingResult);
                // res.send(response.result);
            }).catch(function (response) {
                //res.send(response)
                console.log(response);
            });
        });
    }
    getCheapestFlightDates(source, destination) {
        return __awaiter(this, void 0, void 0, function* () {
            let flights = [
            //x { id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
            //{ id:'1', type:'', instantTicketingRequired:true, oneWay:true, lastTicketingDate:'', nonHomogeneous:true, source: 'MAD', destination: 'MUC', departure: '2022:11:11', returnDate: '2022:11:13', price: '133', duration: '12:21' },
            ];
            return flights;
        });
    }
    getFlightOffer(source, destination, departureDate, adults, maxFlights) {
        return __awaiter(this, void 0, void 0, function* () {
            return amadeus.shopping.flightOffersSearch.get({
                originLocationCode: source,
                destinationLocationCode: destination,
                departureDate: departureDate,
                adults: adults,
                max: maxFlights
            }).then(function (response) {
                const objectMapper = new jackson_js_1.ObjectMapper();
                if (!response)
                    return null;
                const result = JSON.stringify(response.data);
                //objectMapper.configure();
                let flightsParsed;
                //flightsParsed = new Array<FlightOffer>();
                flightsParsed = objectMapper.parse(result, { mainCreator: () => [Array, [FlightOffer_1.FlightOffer]] });
                //const JsonFlights = objectMapper.parse<FlightOffer>(result);
                //keep the json version of the object in the original property
                for (var i = 0; i < flightsParsed.length; i++) {
                    flightsParsed[i].original = JSON.stringify(response.data[i]); //JSON.stringify([JsonFlights][i]);
                }
                return flightsParsed;
            }).catch(function (error) {
                throw error;
            });
        });
    }
    getFlightAvailability(source, destination, departureDate, adults) {
        return __awaiter(this, void 0, void 0, function* () {
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
                .then(function (response) {
                let flightData = response.data; //jp.query(JSON.parse(response.data), "$[*]");
                let dataCount = flightData.length;
                let results;
                results = new Array();
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
                    let flight = {
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
                    };
                    results.push(flight);
                } // close for loop
                return results;
            }).catch(function (error) {
                throw error;
            });
        });
    }
    getAirline(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return amadeus.referenceData.airlines.get({
                airlineCodes: code
            }).then(function (response) {
                let airlineData = response.data[0]; //jp.query(JSON.parse(response.data), "$[*]");
                let result = {
                    iataCode: airlineData.iataCode,
                    type: airlineData.type,
                    icaoCode: airlineData.icaoCode,
                    businessName: airlineData.businessName,
                    commonName: airlineData.commonName
                };
                return result;
            }).catch(function (error) {
                throw error;
            });
        });
    }
}
exports.AmadeusRepo = AmadeusRepo;
//# sourceMappingURL=IAmadeusMockRepo.js.map