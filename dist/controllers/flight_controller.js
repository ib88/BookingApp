"use strict";
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
const { AmadeusMockRepo, AmadeusRepo, airlineInfo } = require("../Repositories/IAmadeusMockRepo");
const { DatesInfo } = require("../Models/DatesInfo");
const jackson_js_1 = require("jackson-js");
const FlightOffer_1 = require("../Models/FlightOffer");
const { API_KEY, API_SECRET } = require("../config");
const Amadeus = require("amadeus");
const express = require("express");
const axios = require("axios");
var _ = require("underscore");
const { check, validationResult } = require('express-validator');
var bodyParser = require("body-parser");
var jp = require('jsonpath');
var app = express();
app.set("view engine", "ejs");
//app.set('views', path.join(__dirname,"views"));
//app.set("view engine", "ejs");
//app.use(express.static("public"));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
// Create router
const router = express.Router();
// Create Amadeus API client
const amadeus = new Amadeus({
    clientId: API_KEY,
    clientSecret: API_SECRET,
    hostname: 'production'
});
const objectMapper = new jackson_js_1.ObjectMapper();
const amadeusRepo = new AmadeusRepo();
// Initialization
//var sess; // global session, NOT recommended
// Location search suggestions
// router.get(`/flightsearch`, async (req, res) => {
//   // ackson-js
//   // Find the cheapest flights from SYD to BKK
//   // let flights = await new AmadeusMockRepo().getFlights();
//   // return res.json(flights);
// });
router.get(`/bookFlight`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { flight, iataCode } = req.query;
    req.session.flightJson = flight;
    //req.session.flight = flight;
    req.session.save();
    let flightParsed = objectMapper.parse(flight, { mainCreator: () => [FlightOffer_1.FlightOffer] });
    //compute the departure and arrival time of the whole flight by summing up the times for individual flight segments
    let carrierResult = undefined;
    let airlineCode = undefined;
    let results = new DatesInfo(flightParsed).getDates();
    flightParsed.departure_.at_ = results.departure;
    flightParsed.departure_.iataCode_ = results.iataCodeDeparture;
    flightParsed.arrival_.at_ = results.arrival;
    flightParsed.arrival_.iataCode_ = results.iataCodeArrival;
    ///compute the operating Airline Names of the flight
    for (var j = 0; j < flightParsed.itineraries_[0].segments_.length; j++) {
        airlineCode = flightParsed.itineraries_[0].segments_[j].carrierCode_;
        carrierResult = yield amadeusRepo.getAirline(airlineCode);
        flightParsed.itineraries_[0].segments_[j].carrierName_ = carrierResult.businessName;
    }
    //////
    req.session.flightJson = flight;
    req.session.flightParsed = flightParsed;
    return res.render("booking_step1.ejs", { flight: flightParsed });
}));
router.post(`/bookFlight`, [
    check('firstName')
        .not()
        .isEmpty()
        .withMessage('Enter a first name'),
    check('lastName')
        .not()
        .isEmpty()
        .withMessage('Enter a last name'),
    check('email')
        .not()
        .isEmpty()
        .withMessage('Enter an email'),
    check('birthDate')
        .not()
        .isEmpty()
        .withMessage('Chose a birth date')
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const { flight, iataCode } = req.query;
    let flightParsed = undefined;
    let alert = undefined;
    if (req.session.flightParsed)
        flightParsed = req.session.flightParsed;
    //let flightParsed = objectMapper.parse < FlightOffer > (flight, { mainCreator: () => [FlightOffer] });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        alert = errors.array();
        return res.render("booking_step1.ejs", { alert, flight: flightParsed });
    }
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let birthDate = req.body.birthDate;
    let gender = "MALE";
    let email = req.body.email;
    let traveler = {
        first_name: firstName,
        last_name: lastName,
        email_: email
    };
    //let pricingOfferStr = flights[1].original;
    let pricingOffer = undefined;
    if (req.session.flightJson)
        pricingOffer = JSON.parse(req.session.flightJson);
    let pricingResponse = yield amadeusRepo.confirmFlight(pricingOffer);
    //console.log("Flight confirmation response:", pricingResponse.result);
    // bookFlight(pricingResponse: any, firstName:string, lastName:string, birthDate:string, gender:string, email:string): Promise<any>
    let bookingResult = yield amadeusRepo.bookFlight(pricingResponse, firstName, lastName, birthDate, gender, email);
    //console.log("Flight Booking response:", bookingResult);
    let emailResult = yield amadeusRepo.sendEmail("imefire@gmail.com", "imefire@gmail.com", "Booking confirmation", bookingResult.data.id, "<b>" + bookingResult.data.id + "</b>");
    return res.render("booking_step3.ejs", { alert: alert, result: bookingResult, flight: flightParsed, travelerInfos: traveler });
}));
router.get(`/`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { source, destination, flightDate, adults } = req.query;
    if (!source || !destination || !flightDate || !adults) {
        return res.render("flights", { business: [] });
    }
    return res.render("flights", { business: [] });
}));
router.post(`/flightOffer`, [
    check('sourceFlight')
        .not()
        .isEmpty()
        .withMessage('Chose a departing Airport'),
    check('destinationFlight')
        .not()
        .isEmpty()
        .withMessage('Chose a destination Airport'),
    check('datepickerSourceFlight')
        .not()
        .isEmpty()
        .withMessage('Chose a departing date'),
    check('adultsFlight')
        .not()
        .isEmpty()
        .withMessage('Chose the number of adults')
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the cheapest flights from SYD to BKK
    // Find cheapest dates from Madrid to Munich
    //  const { source,destination,departureDate,returnDate,adults} = req.query;
    //  if(!source || !destination || !departureDate || !returnDate || !adults) {
    //    return res.render("flights", { business: [] });
    //  }
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   const alert = errors.array()
    //   return res.render("flights", { alert });
    // }
    var sourceCode = "LAX";
    var destinationCode = "SEA";
    //var sourceCode = req.body.sourceFlightCode;
    //var destinationCode = req.body.destinationFlightCode;
    //var dateSourceFlight = req.body.datepickerSourceFlight;
    var dateSourceFlight = '2022-12-20';
    //var adults = req.body.adultsFlight;
    var adults = '1';
    var maxFlights = '5';
    try {
        let flights = yield amadeusRepo.getFlightOffer(sourceCode, destinationCode, dateSourceFlight, adults, maxFlights);
        if (!flights) {
            return res.render("flights", { business: 'undefined' });
        }
        //let flightTimes = [];
        let carrierResult = undefined;
        let airlineCode = undefined;
        //compute the departure and arrival time of the whole flight by summing up the times for individual flight segments
        for (var i = 0; i < flights.length; i++) {
            let results = new DatesInfo(flights[i]).getDates();
            flights[i].departure_.at_ = results.departure;
            flights[i].departure_.iataCode_ = results.iataCodeDeparture;
            flights[i].arrival_.at_ = results.arrival;
            flights[i].arrival_.iataCode_ = results.iataCodeArrival;
            ///compute the operating Airline Names of the flight
            for (var j = 0; j < flights[i].itineraries_[0].segments_.length; j++) {
                airlineCode = flights[i].itineraries_[0].segments_[j].carrierCode_;
                carrierResult = yield amadeusRepo.getAirline(airlineCode);
                flights[i].itineraries_[0].segments_[j].carrierName_ = carrierResult.businessName;
            }
        }
        ////confirm a flight
        //const flight = flights[0];
        // Confirm availability and price
        let pricingOfferStr = flights[1].original;
        let pricingOffer = JSON.parse(pricingOfferStr);
        let bookingOffer = undefined;
        //pricingOffer.price.grandTotal = "20";
        //pricingOffer.price.total = "20";
        //let pricingResponse = await amadeusRepo.confirmFlight(pricingOffer);
        //console.log("Flight confirmation response:", pricingResponse.result);
        //let bookingResult = await amadeusRepo.bookFlight(pricingResponse);
        //console.log("Flight Booking response:", bookingResult);
        // amadeus.shopping.flightOffers.pricing.post(
        //   JSON.stringify({
        //     'data': {
        //       'type': 'flight-offers-pricing',
        //       'flightOffers': [pricingOffer],
        //     }
        //   })
        // ).then(function (response) {
        //   console.log("Flight confirmation response:", response.result);
        //   //bookingOffer=response;
        //   let bookingResult =  amadeusRepo.bookFlight(response);
        //   console.log("Flight Booking response:", bookingResult);
        //   // res.send(response.result);
        // }).catch(function (response) {
        //   //res.send(response)
        //   console.log(response);
        // });
        // let bookingResult = await amadeusRepo.bookFlight(bookingOffer);
        // console.log("Flight Booking response:", bookingResult.result);
        //////////////////////////////
        return res.render("flights", { business: flights });
    }
    catch (err) {
        res.json(err);
    }
}));
router.get(`/cheapestDates`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the cheapest flights from SYD to BKK
    // Find cheapest dates from Madrid to Munich
    amadeus.shopping.flightDates.get({
        origin: 'LON',
        destination: 'MUC'
        // departureDate:  '2022-09-10'
    }).then(function (response) {
        return res.json(response);
    }).catch(function (response) {
        console.error(response);
    });
}));
router.get(`/getAirline`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the cheapest flights from SYD to BKK
    // Find cheapest dates from Madrid to Munich
    amadeus.referenceData.airlines.get({
        airlineCodes: 'TR'
    }).then(function (response) {
        console.log(response);
    }).catch(function (response) {
        console.error(response);
    });
}));
router.get(`/flightAvSearch`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the cheapest flights from SYD to BKK
    // Find cheapest dates from Madrid to Munich
    const { source, destination, departureDate, adults, returnDate } = req.query;
    if (!source || !destination || !departureDate || !returnDate || !adults) {
        return res.render("flights", { business: [] });
    }
    // var sourceCode = req.body.sourceFlightCode;
    // var destinationCode = req.body.destinationFlightCode;
    // var dateSourceFlight = req.body.datepickerSourceFlight;
    // var adults = req.body.adults;
    try {
        //readonly moqRepo: AmadeusMockRepo;
        const result = yield new AmadeusRepo().getFlightAvailability("MAD", "MUC");
        return res.json(result);
        //return res.render("flights", { business: result });
    }
    catch (err) {
        res.json(err);
    }
}));
router.post(`/flightAvSearch`, [
    check('sourceFlight')
        .not()
        .isEmpty()
        .withMessage('Chose a departing Airport'),
    check('destinationFlight')
        .not()
        .isEmpty()
        .withMessage('Chose a destination Airport'),
    check('datepickerSourceFlight')
        .not()
        .isEmpty()
        .withMessage('Chose a departing date'),
    check('adultsFlight')
        .not()
        .isEmpty()
        .withMessage('Chose the number of adults')
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the cheapest flights from SYD to BKK
    // Find cheapest dates from Madrid to Munich
    //  const { source,destination,departureDate,returnDate,adults} = req.query;
    //  if(!source || !destination || !departureDate || !returnDate || !adults) {
    //    return res.render("flights", { business: [] });
    //  }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alert = errors.array();
        return res.render("flights", { alert });
        //return res.status(422).jsonp(errors.array());
    }
    var sourceCode = req.body.sourceFlightCode;
    var destinationCode = req.body.destinationFlightCode;
    var dateSourceFlight = req.body.datepickerSourceFlight;
    var adults = req.body.adultsFlight;
    try {
        //readonly moqRepo: AmadeusMockRepo;
        const result = yield new AmadeusRepo().getFlightAvailability(sourceCode, destinationCode, dateSourceFlight, adults);
        //return res.json(result);
        return res.render("flights", { business: result });
    }
    catch (err) {
        res.json(err);
    }
}));
module.exports = router;
//# sourceMappingURL=flight_controller.js.map