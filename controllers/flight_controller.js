
const { AmadeusMockRepo, AmadeusRepo, airlineInfo } = require("../Repositories/IAmadeusMockRepo");
const { DatesInfo } = require("../Models/DatesInfo");

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create router
const router = express.Router();
// Create Amadeus API client
const amadeus = new Amadeus({
  clientId: API_KEY,
  clientSecret: API_SECRET,
});

// Location search suggestions

router.get(`/flightsearch`, async (req, res) => {

  // ackson-js

  // Find the cheapest flights from SYD to BKK
  // let flights = await new AmadeusMockRepo().getFlights();
  // return res.json(flights);
});

router.get(`/tryBooking`, async (req, res) => {

  const { flightInfo,iataCode} = req.query;
  console.log(flightInfo);
});


router.get(`/flightOffer`, async (req, res) => {

  const { source,destination,flightDate,adults} = req.query;
  if(!source || !destination || !flightDate || !adults) {
    return res.render("flights", { business: [] });
  }

  // Find the cheapest flights from SYD to BKK
  // let flights = await new AmadeusRepo().getFlightOffer();
  // let flightTimes = [];
  // for (var i = 0; i < flights.length; i++) {

  //   let results = new DatesInfo(flights[i]).getDates();
  //   flights[i].departure_.at_ = results.departure;
  //   flights[i].departure_.iataCode_ = results.iataCodeDeparture;

  //   flights[i].arrival_.at_ = results.arrival;
  //   flights[i].arrival_.iataCode_ = results.iataCodeArrival;


  //   // let flightTime = {
  //   //   departure: results.departure,
  //   //   arrival: results.arrival
  //   // };
  //   // flightTimes.push(flightTime);
  // }
  return res.render("flights", { business: [] });

  //return res.json(flights);
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
], async (req, res) => {
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
  var maxFlights = '5';

  try {
    let amadeusRepo = new AmadeusRepo();
    let flights = await amadeusRepo.getFlightOffer(sourceCode, destinationCode, dateSourceFlight, adults, maxFlights);
    if (!flights)
    {
      return res.render("flights", { business: 'undefined' }); 
    }
    let flightTimes = [];
    let carrierResult = undefined;
    let airlineCode = undefined;
  
    for (var i = 0; i < flights.length; i++) {

      let results = new DatesInfo(flights[i]).getDates();
      flights[i].departure_.at_ = results.departure;
      flights[i].departure_.iataCode_ = results.iataCodeDeparture;

      flights[i].arrival_.at_ = results.arrival;
      flights[i].arrival_.iataCode_ = results.iataCodeArrival;
      ///compute the operating Airline Name
      for (var j=0; j< flights[i].itineraries_[0].segments_.length; j++)
      {
        airlineCode = flights[i].itineraries_[0].segments_[j].carrierCode_;
          carrierResult = await amadeusRepo.getAirline(airlineCode);
          flights[i].itineraries_[0].segments_[j].carrierName_ = carrierResult.businessName;
      }
    }
    return res.render("flights", { business: flights });
  }
  catch (err) {
    res.json(err);
  }
});



router.get(`/cheapestDates`, async (req, res) => {
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
});

router.get(`/getAirline`, async (req, res) => {
  // Find the cheapest flights from SYD to BKK
  // Find cheapest dates from Madrid to Munich
  amadeus.referenceData.airlines.get({
    airlineCodes: 'TR'
  }).then(function (response) {
    console.log(response);
  }).catch(function (response) {
    console.error(response);
  });
});

router.get(`/flightAvSearch`, async (req, res) => {
  // Find the cheapest flights from SYD to BKK
  // Find cheapest dates from Madrid to Munich
  const { source, destination, departureDate, adults } = req.query;
  if (!source || !destination || !departureDate || !returnDate || !adults) {
    return res.render("flights", { business: [] });
  }
  var sourceCode = req.body.sourceFlightCode;
  var destinationCode = req.body.destinationFlightCode;
  var dateSourceFlight = req.body.datepickerSourceFlight;
  adults = req.body.adults;
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
], async (req, res) => {
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