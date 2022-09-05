
// router.js
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
      departureDate: '2022-09-05',
      adults: '2'
    }).then(function (response) {
      console.log(response);
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
      console.log(response);
    }).catch(function (response) {
      console.error(response);
    });
});

router.get(`/flightAvSearch`, async (req, res) => {
  // Find the cheapest flights from SYD to BKK
 	// Find cheapest dates from Madrid to Munich
   body = JSON.stringify({
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
  })
  
  amadeus.shopping.availability.flightAvailabilities.post(body).then(function (response) {
    console.log(response);
  }).catch(function (response) {
    console.error(response);
  });
});

module.exports = router;