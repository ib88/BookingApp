
const { AmadeusMockRepo, AmadeusRepo, airlineInfo } = require("../Repositories/IAmadeusMockRepo");
const { DatesInfo } = require("../Models/DatesInfo");
import { ObjectMapper } from "jackson-js";
import { FlightOffer } from "../Models/FlightOffer";
const { API_KEY, API_SECRET, PUBLISHABLE_KEY, SECRET_KEY } = require("../config");
const Amadeus = require("amadeus");
const express = require("express");

const stripe = require('stripe')(SECRET_KEY);

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

router.get(`/bookFlight`, async (req: any, res: any) => {

  const { flight, iataCode } = req.query;
  req.session.flightJson = flight;
  //req.session.flight = flight;
  req.session.save();

  let flightParsed = objectMapper.parse<FlightOffer>(flight, { mainCreator: () => [FlightOffer] });

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
    carrierResult = await amadeusRepo.getAirline(airlineCode);
    flightParsed.itineraries_[0].segments_[j].carrierName_ = carrierResult.businessName;
  }
  //////
  req.session.flightJson = flight;
  req.session.flightParsed = flightParsed;

  return res.render("booking_step1.ejs", { flight: flightParsed });

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

  let pricingResponse;
  let bookingResult;
  try {
    pricingResponse = await amadeusRepo.confirmFlight(pricingOffer);

  } catch (e: any) {
    return res.render("error.ejs", { alert: "the flihgt might have been booked already!" +"Detail: " + e.response.body });
  }

  try {
     bookingResult = await amadeusRepo.bookFlight(pricingResponse, firstName, lastName, birthDate, gender, email);

  } catch (e: any) {
    return res.render("error.ejs", { alert: "the flihgt might have been booked already!" +"Detail: " + e.response.body });
  }
  req.session.bookingResult = bookingResult;
  req.session.traveler = traveler;


  //console.log("Flight Booking response:", bookingResult);
  //let emailResult = await amadeusRepo.sendEmail("imefire@gmail.com", "imefire@gmail.com", "Booking confirmation", bookingResult.data.id,"<b>"+ bookingResult.data.id + "</b>");

  //return res.render("booking_step3.ejs", { alert:alert, result: bookingResult, flight: flightParsed, travelerInfos: traveler });
  return res.render("stripe_payment", { key: PUBLISHABLE_KEY, flight: flightParsed });



});

router.get(`/stripePayment`, async (req: any, res: any) => {
  return res.render("stripe_payment", { key: PUBLISHABLE_KEY });
});

router.post(`/stripePayment`, async (req: any, res: any) => {

  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken,
    name: 'Gourav Hammad',
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
        description: 'Web Development Product',
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

      let alert=undefined;
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
      return res.render("error.ejs",{alert:alert});
    });

});


router.get(`/flightOffer`, async (req: any, res: any) => {

  const { source, destination, flightDate, adults } = req.query;
  if (!source || !destination || !flightDate || !adults) {
    return res.render("flights", { business: [] });
  }
  return res.render("flights", { business: [] });

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
    return res.render("flights", { alert });
  }

  // var sourceCode = "LAX";
  // var destinationCode = "SEA";
  // var dateSourceFlight = '2022-12-20';
  // var adults = '1';


  var sourceCode = req.body.sourceFlightCode;
  var destinationCode = req.body.destinationFlightCode;
  var dateSourceFlight = req.body.datepickerSourceFlight;
  var adults = req.body.adultsFlight;
  var maxFlights = '5';

  try {
    let flights = await amadeusRepo.getFlightOffer(sourceCode, destinationCode, dateSourceFlight, adults, maxFlights);
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
        carrierResult = await amadeusRepo.getAirline(airlineCode);
        flights[i].itineraries_[0].segments_[j].carrierName_ = carrierResult.businessName;
      }
    }
    ////confirm a flight
    //const flight = flights[0];
    // Confirm availability and price
    let pricingOfferStr = flights[1].original;
    let pricingOffer = JSON.parse(pricingOfferStr);
    let bookingOffer = undefined;

    return res.render("flights", { business: flights });
  }
  catch (err) {
    res.json(err);
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