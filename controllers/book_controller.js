
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

router.post(`/book-hotel`, async (req, res) => {
    try {
      const { guests, payments, offerId } = req.body;
      const response = await amadeus.booking.hotelBookings.post(
        JSON.stringify({
          data: {
            offerId,
            guests,
            payments,
          },
        })
      );
  
      res.json(JSON.parse(response.body));
    } catch (err) {
      res.json(err);
    }
  });

  module.exports = router;