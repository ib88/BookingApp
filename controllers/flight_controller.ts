
const { AmadeusMockRepo, AmadeusRepo, airlineInfo } = require("../Repositories/IAmadeusMockRepo");
const { DatesInfo } = require("../Models/DatesInfo");
import { ObjectMapper } from "jackson-js";
import { FlightOffer } from "../Models/FlightOffer";
const { API_KEY, API_SECRET, STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = require("../config");
const Amadeus = require("amadeus");
const express = require("express");

const stripe = require('stripe')(STRIPE_SECRET_KEY);

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
// const amadeus = new Amadeus({
//   clientId: API_KEY,
//   clientSecret: API_SECRET,
//   hostname: 'production'
// });

const objectMapper = new ObjectMapper();
const amadeusRepo = new AmadeusRepo();
const amadeusMockRepo = new AmadeusMockRepo();

router.get(`/bookFlight`, async (req: any, res: any) => {

  const { flight, iataCode } = req.query;
  req.session.flightJson = flight;
  //req.session.flight = flight;
  req.session.save();
  try {

    let flightParsed = objectMapper.parse<FlightOffer>(flight, { mainCreator: () => [FlightOffer] });

    //compute the departure and arrival time of the whole flight by summing up the times for individual flight segments
    let carrierResult = undefined;
    let airlineCode = undefined;

    let results = new DatesInfo(flightParsed).getDates();
    let returnResults = undefined;

    //only if the flight is 2 ways
    if (typeof flightParsed.itineraries_[1] !== 'undefined')
      returnResults = new DatesInfo(flightParsed).getReturnDates();

    flightParsed.departure_.at_ = results.departure;
    flightParsed.departure_.iataCode_ = results.iataCodeDeparture;

    flightParsed.arrival_.at_ = results.arrival;
    flightParsed.arrival_.iataCode_ = results.iataCodeArrival;

    //only if the flight is 2 ways

    if (typeof flightParsed.itineraries_[1] !== 'undefined') {
      flightParsed.returnDeparture_.at_ = returnResults.departure;
      flightParsed.returnDeparture_.iataCode_ = returnResults.iataCodeDeparture;

      flightParsed.returnArrival_.at_ = returnResults.arrival;
      flightParsed.returnArrival_.iataCode_ = returnResults.iataCodeArrival;
    }


    ///compute the operating Airline Names of the flight
    for (var j = 0; j < flightParsed.itineraries_[0].segments_.length; j++) {
      airlineCode = flightParsed.itineraries_[0].segments_[j].carrierCode_;
      carrierResult = await amadeusRepo.getAirline(airlineCode);
      flightParsed.itineraries_[0].segments_[j].carrierName_ = carrierResult.businessName;
    }

    //only if the flight is 2 ways
    ///compute the operating Airline Names for the one way flight

    if (typeof flightParsed.itineraries_[1] !== 'undefined') {
      for (var j = 0; j < flightParsed.itineraries_[1].segments_.length; j++) {
        airlineCode = flightParsed.itineraries_[1].segments_[j].carrierCode_;
        carrierResult = await amadeusRepo.getAirline(airlineCode);
        flightParsed.itineraries_[1].segments_[j].carrierName_ = carrierResult.businessName;
      }
    }

    req.session.flightJson = flight;
    req.session.flightParsed = flightParsed;

    return res.render("booking_step1.ejs", { flight: flightParsed });
  }
  catch (err: any) {
    return res.render("flights.ejs", { business: undefined, apiError: "Error loading the flight. Please try again!",alert:undefined, hotels:undefined });
  }

});

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
], async (req: any, res: any) => {

  //const { flight, iataCode } = req.query;
  let flightParsed = undefined;
  let alert = undefined;

  if (req.session.flightParsed)
    flightParsed = req.session.flightParsed;
  //let flightParsed = objectMapper.parse < FlightOffer > (flight, { mainCreator: () => [FlightOffer] });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    alert = errors.array()
    return res.render("booking_step1.ejs", { alert:alert, flight: flightParsed });
  }

  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let birthDate = req.body.birthDate;
  let gender = "MALE";
  let email = req.body.email;
  let traveler = undefined;
  let cardNumber = req.body.cardNumber;
  let expiryDate = req.body.expiryDate;
  let cvcCode = req.body.cvcCode;

  traveler = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    cardNumber: cardNumber,
    expiryDate: expiryDate,
    cvcCode: cvcCode
  };

  //let pricingOfferStr = flights[1].original;
  let pricingOffer = undefined;
  if (req.session.flightJson)
    pricingOffer = JSON.parse(req.session.flightJson);

  let pricingResponse;
  let bookingResult;
  try {

    pricingResponse = await amadeusRepo.confirmFlight(pricingOffer);

  } catch (e: any) {
    //return res.render("booking_step1.ejs", { apiError: "the flihgt might have been booked already!", flight: undefined });
    return res.render("flights.ejs", { alert: undefined, apiError: "The flight might be full already!", business: undefined,hotels:undefined });

  }

  try {
    bookingResult = await amadeusRepo.bookFlight(pricingResponse, traveler);

  } catch (e: any) {
    return res.render("flights.ejs", { alert: undefined, apiError: "The flight might be full already!", business: undefined,hotels:undefined });
    //return res.render("error.ejs", { alert: "the flihgt might have been booked already!" });
  }
  req.session.bookingResult = bookingResult;
  req.session.traveler = traveler;


  //console.log("Flight Booking response:", bookingResult);
  //let emailResult = await amadeusRepo.sendEmail("imefire@gmail.com", "imefire@gmail.com", "Booking confirmation", bookingResult.data.id,"<b>"+ bookingResult.data.id + "</b>");

  //return res.render("booking_step3.ejs", { alert:alert, result: bookingResult, flight: flightParsed, travelerInfos: traveler });
  //return res.render("booking_step3", { key: STRIPE_PUBLISHABLE_KEY, flight: flightParsed, travelerInfos: traveler });
  return res.render("booking_step3.ejs", { result: req.session.bookingResult, flight: req.session.flightParsed, travelerInfos: req.session.traveler });




});

router.get(`/stripePayment`, async (req: any, res: any) => {
  return res.render("stripe_payment", { key: STRIPE_PUBLISHABLE_KEY });
});

router.post(`/stripePayment`, async (req: any, res: any) => {

  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken,
    name: req.session.traveler.first_name + ' ' + req.session.traveler.last_name,
    address: {
      line1: 'TC 9/4 Old MES colony',
      postal_code: '452331',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
    }
  })
    .then((customer: any) => {

      return stripe.charges.create({
        amount: (req.session.flightParsed.price_.total_ * 100),     // Charging Rs 25
        description: 'Flight Invoice',
        currency: 'EUR',
        customer: customer.id
      });
    })
    .then((charge: any) => {
      //res.send("Success")  // If no error occurs
      //return res.render("success_payment.ejs");
      if (req.session.bookingResult && req.session.flightParsed && req.session.traveler)
        return res.render("booking_step3.ejs", { result: req.session.bookingResult, flight: req.session.flightParsed, travelerInfos: req.session.traveler });

    })
    .catch((err: any) => {

      let alert = undefined;
      switch (err.type) {
        case 'StripeCardError':
          // A declined card error
          alert = "Your card's expiration year is invalid.";
          break;
        case 'StripeRateLimitError':
          // Too many requests made to the API too quickly
          alert = "Too many requests made to the API too quickly.";
          break;
        case 'StripeInvalidRequestError':
          // Invalid parameters were supplied to Stripe's API
          alert = "Invalid parameters were supplied to Stripe's API";
          break;
        case 'StripeAPIError':
          // An error occurred internally with Stripe's API
          alert = "An error occurred internally with Stripe's API";
          break;
        case 'StripeConnectionError':
          alert = "Some kind of error occurred during the HTTPS communication";
          // Some kind of error occurred during the HTTPS communication
          break;
        case 'StripeAuthenticationError':
          // You probably used an incorrect API key
          alert = "You probably used an incorrect API key";
          break;
        default:
          alert = err.message;
          break;
      }
      //return res.render("error.ejs", { alert: alert });
      return res.render("flights.ejs", { apiError: alert, business: undefined, alert: undefined });
      //return res.render("booking_step3.ejs", { result: req.session.bookingResult, flight: req.session.flightParsed, travelerInfos: req.session.traveler, apiError: alert });

    });

});


router.get(`/flightOffer`, async (req: any, res: any) => {

  const { source, destination, flightDate, adults } = req.query;
  if (!source || !destination || !flightDate || !adults) {

    return res.render("flights", {alert:undefined, business: [],hotels:undefined,apiError:undefined });

  }
  return res.render("flights", {alert:undefined,business: null,hotels:undefined,apiError:undefined });

});

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
], async (req: any, res: any) => {
  // Find the cheapest flights from SYD to BKK
  // Find cheapest dates from Madrid to Munich
  //  const { source,destination,departureDate,returnDate,adults} = req.query;
  //  if(!source || !destination || !departureDate || !returnDate || !adults) {
  //    return res.render("flights", { business: [] });
  //  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const alert = errors.array()
    return res.render("flights", {anchor: '#alert',alert:alert,hotels:undefined,business:undefined,apiError:undefined});
  }

  // var sourceCode = "LAX";
  // var destinationCode = "SEA";
  // var dateSourceFlight = '2022-12-20';
  // var adults = '1';


  var sourceCode = req.body.sourceFlightCode;
  var destinationCode = req.body.destinationFlightCode;
  var dateSourceFlight = req.body.datepickerSourceFlight;
  var dateReturnFlight = req.body.datepickerReturnFlight;//'2023-04-10';


  var adults = req.body.adultsFlight;
  var children = req.body.childrenFlight;
  var maxFlights = '5';

  let errorMsg = undefined;
  try {
    //throw new Error('Throw makes it go boom!');
    //let flights = await amadeusRepo.getFlightOffer(sourceCode, destinationCode, dateSourceFlight, adults, children, maxFlights);
    let flights = undefined;

    if (typeof dateReturnFlight !== 'undefined' && dateReturnFlight != '')

      flights = await amadeusRepo.getFlightOffer(sourceCode, destinationCode, dateSourceFlight, adults, children, maxFlights, dateReturnFlight);
    else
      flights = await amadeusRepo.getFlightOffer(sourceCode, destinationCode, dateSourceFlight, adults, children, maxFlights);


    //let flights = await amadeusMockRepo.getFlightOfferReturnsNull(sourceCode, destinationCode, dateSourceFlight, adults, maxFlights);
    if (!flights || flights == undefined || flights == null) {
      //return res.render("error.ejs", { alert: "the flihgt might have been booked already!" });
      return res.render("flights", { alert:undefined, apiError:"An error has occured while loading the flight. Please try again!", business: undefined,hotels:undefined });
    }
    if (flights.length == 0) {
      return res.render("flights", { business: undefined,hotels:undefined });
    }
    //let flightTimes = [];
    let carrierResult = undefined;
    let airlineCode = undefined;

    //compute the departure and arrival time of the whole flight by summing up the times for individual flight segments
    for (var i = 0; i < flights.length; i++) {

      let results = new DatesInfo(flights[i]).getDates();
      let returnResults;

      //only if the flight is 2 ways
      if (typeof dateReturnFlight !== 'undefined' && dateReturnFlight != '')

        returnResults = new DatesInfo(flights[i]).getReturnDates();

      flights[i].departure_.at_ = results.departure;
      flights[i].departure_.iataCode_ = results.iataCodeDeparture;
      flights[i].arrival_.at_ = results.arrival;
      flights[i].arrival_.iataCode_ = results.iataCodeArrival;

      //only if the flight is 2 ways

      if (typeof dateReturnFlight !== 'undefined' && dateReturnFlight != '') {

        flights[i].returnDeparture_.at_ = returnResults.departure;
        flights[i].returnDeparture_.iataCode_ = returnResults.iataCodeDeparture;
        flights[i].returnArrival_.at_ = returnResults.arrival;
        flights[i].returnArrival_.iataCode_ = returnResults.iataCodeArrival;
      }
      ///compute the operating Airline Names for the one way flight
      for (var j = 0; j < flights[i].itineraries_[0].segments_.length; j++) {
        airlineCode = flights[i].itineraries_[0].segments_[j].carrierCode_;
        carrierResult = await amadeusRepo.getAirline(airlineCode);
        flights[i].itineraries_[0].segments_[j].carrierName_ = carrierResult.businessName;
      }

      //only if the flight is 2 ways
      ///compute the operating Airline Names for the one way flight

      if (typeof dateReturnFlight !== 'undefined' && dateReturnFlight != '') {

        for (var j = 0; j < flights[i].itineraries_[1].segments_.length; j++) {
          airlineCode = flights[i].itineraries_[1].segments_[j].carrierCode_;
          carrierResult = await amadeusRepo.getAirline(airlineCode);
          flights[i].itineraries_[1].segments_[j].carrierName_ = carrierResult.businessName;
        }
      }

      //flights[i].original=flights[i];

    }
    // Confirm availability and price
    let pricingOfferStr = flights[1].original;
    let pricingOffer = JSON.parse(pricingOfferStr);
    let bookingOffer = undefined;

    return res.render("flights", {anchor: '#flight-results', business: flights,hotels:undefined, apiError: undefined, alert: undefined });
  }
  catch (err: any) {

    return res.render("flights.ejs", { alert: undefined, apiError: "Something went wrong. Please see weither the inputs you entered is correct and try again.", business: undefined,hotels:undefined });

  }
});



// router.get(`/cheapestDates`, async (req: any, res: any) => {
//   // Find the cheapest flights from SYD to BKK
//   // Find cheapest dates from Madrid to Munich
//   amadeus.shopping.flightDates.get({
//     origin: 'LON',
//     destination: 'MUC'
//     // departureDate:  '2022-09-10'
//   }).then(function (response: any) {
//     return res.json(response);
//   }).catch(function (response: any) {
//     console.error(response);
//   });
// });

// router.get(`/getAirline`, async (req: any, res: any) => {
//   // Find the cheapest flights from SYD to BKK
//   // Find cheapest dates from Madrid to Munich
//   amadeus.referenceData.airlines.get({
//     airlineCodes: 'TR'
//   }).then(function (response: any) {
//     console.log(response);
//   }).catch(function (response: any) {
//     console.error(response);
//   });
// });

router.get(`/flightAvSearch`, async (req: { query: { source: any; destination: any; departureDate: any; returnDate: any; adults: any; }; body: { sourceFlightCode: any; destinationFlightCode: any; datepickerSourceFlight: any; adults: any; }; }, res: { render: (arg0: string, arg1: { business: never[]; }) => any; json: (arg0: unknown) => void; }) => {
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
    const result = await new AmadeusRepo().getFlightAvailability("MAD", "MUC");
    return res.json(result);
    //return res.render("flights", { business: result });
  }
  catch (err) {
    res.json(err);
  }
});

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
], async (req: { body: { sourceFlightCode: any; destinationFlightCode: any; datepickerSourceFlight: any; adultsFlight: any; }; }, res: { render: (arg0: string, arg1: { alert?: any; business?: any; }) => any; json: (arg0: unknown) => void; }) => {
  // Find the cheapest flights from SYD to BKK
  // Find cheapest dates from Madrid to Munich
  //  const { source,destination,departureDate,returnDate,adults} = req.query;
  //  if(!source || !destination || !departureDate || !returnDate || !adults) {
  //    return res.render("flights", { business: [] });
  //  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const alert = errors.array()
    return res.render("flights", { alert });
    //return res.status(422).jsonp(errors.array());
  }

  var sourceCode = req.body.sourceFlightCode;
  var destinationCode = req.body.destinationFlightCode;
  var dateSourceFlight = req.body.datepickerSourceFlight;
  var adults = req.body.adultsFlight;

  try {
    //readonly moqRepo: AmadeusMockRepo;
    const result = await new AmadeusRepo().getFlightAvailability(sourceCode, destinationCode, dateSourceFlight, adults);
    //return res.json(result);
    return res.render("flights", { business: result });
  }
  catch (err) {
    res.json(err);
  }
});

module.exports = router;