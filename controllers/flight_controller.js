
const { AmadeusMockRepo, AmadeusRepo } = require("../Repositories/IAmadeusMockRepo");
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

router.get(`/fligOffer`, async (req, res) => {

  // Find the cheapest flights from SYD to BKK
  let flights = await new AmadeusRepo().getFlightOffer();
  return res.json(flights);
});

router.get(`/cheapestDates`, async (req, res) => {
  // Find the cheapest flights from SYD to BKK
  // Find cheapest dates from Madrid to Munich
  amadeus.shopping.flightDates.get({
    origin: 'MAD',
    destination: 'MUC'
    // departureDate:  '2022-09-10'
  }).then(function (response) {
    return res.json(response);
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