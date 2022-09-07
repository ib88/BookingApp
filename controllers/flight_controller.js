
const { AmadeusMockRepo, AmadeusRepo } = require("../Repositories/IAmadeusMoqRepo");
const { API_KEY, API_SECRET } = require("../config");
const Amadeus = require("amadeus");
const express = require("express");
const axios = require("axios");
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
app.use(bodyParser.urlencoded({extended: false}));

// Create router
const router = express.Router();
// Create Amadeus API client
const amadeus = new Amadeus({
  clientId: API_KEY,
  clientSecret: API_SECRET,
});

// Location search suggestions

router.get(`/flightsearch`, async (req, res) => {
  	// Find the cheapest flights from SYD to BKK
    amadeus.shopping.flightOffersSearch.get({
      originLocationCode: 'SYD',
      destinationLocationCode: 'BKK',
      departureDate: '2022-09-08',
      adults: '2'
    }).then(function (response) {
      return res.json(response);
    }).catch(function (response) {
      console.error(response);
    });
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
  //  const { source,destination,departureDate,returnDate,adults} = req.query;
  //  if(!source || !destination || !departureDate || !returnDate || !adults) {
  //    return res.render("flights", { business: [] });
  //  }
 
     try {
         //readonly moqRepo: AmadeusMockRepo;
         const result = await new AmadeusRepo().getFlightAvailability("MAD","MUC");
         return res.json(result);
         //return res.render("flights", { business: result });
         } 
     catch (err) {
       res.json(err);
     }
});

module.exports = router;