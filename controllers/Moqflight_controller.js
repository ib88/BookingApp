
// router.js
const { AmadeusMockRepo, AmadeusRepo } = require("../Repositories/IAmadeusMoqRepo");
//import type {IAmadeusRepo, AmadeusMockRepo} from '../Repositories/IAmadeusMoqRepo';
const { API_KEY, API_SECRET } = require("../config");
const Amadeus = require("amadeus");
const express = require("express");
const axios = require("axios");
var _ = require("underscore");
//const path = require("path");
var bodyParser = require("body-parser");
var jp = require('jsonpath');
const { addListener } = require("nodemon");

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Create router
const router = express.Router();
// Create Amadeus API client
const amadeus = new Amadeus({
  clientId: API_KEY,
  clientSecret: API_SECRET,
});

router.get(`/flightsearch`, async (req, res) => {
  const { source,destination,departureDate,returnDate,adults} = req.query;
  if(!source || !destination || !departureDate || !returnDate || !adults) {
    return res.render("flights", { business: [] });
  }

    try {
        //readonly moqRepo: AmadeusMockRepo;
        const result = await new AmadeusMockRepo().getCheapestFlightDates("MAD","MUC");
        return res.render("flights", { business: result });
        } 
    catch (err) {
      res.json(err);
    }
  });

  router.post(`/flightsearch`, async (req, res) => {
    var sourceCode = req.body.sourceCode;
    var destinationCode = req.body.destinationCode;
    var departureDate = req.body.departureDate;
    var returnDate = req.body.departureDate;
    var adults = req.body.adults;
    if(!source || !destination || !departureDate || !returnDate || !adults) {
      return res.render("flights", { business: [] });
    }
    try {
          //readonly moqRepo: AmadeusMockRepo;
          const result = await new AmadeusMockRepo().getCheapestFlightDates(sourceCode,destinationCode);
          //console.log("DISPLAY DATA: ", result);
          return res.render("flights", { business: result });
          } 
    catch (err) {
        res.json(err);
      }
    });

  router.get(`/cheapestDates`, async (req, res) => {
    try {
        const { source, destination } = req.query;
        //const moqRepo = new AmadeusMockRepo();
        //const result = await moqRepo.getFlightAvailability(source, destination);          //console.log("DISPLAY DATA: ", displayData);
        return res.render("flights", {business: []});
        } 
    catch (err) {
      res.json(err);
    }
  });

  router.get(`/getAirportSuggestion`, async (req, res) => 
  {
    const { keyword } = req.query;
  
    amadeus.referenceData.locations.get({
          keyword,
          'page[limit]': 5,
          'page[offset]': 0,
          // subType: Amadeus.location.
          subType: 'AIRPORT'
        })
    .then(function (response) {
      var result = jp.query(JSON.parse(response.body), '$.data[*]');
      var hotelData = jp.query(JSON.parse(response.body), '$[*][*]');
  
      var dataCount = hotelData.length;
      var results = [] ;
      for (var i = 0; i < dataCount; i++){
          if (typeof hotelData[i]!='undefined'){
          var displayData = {
              detailedName: hotelData[i].detailedName,
              name: hotelData[i].name,
              subType: hotelData[i].subType,
              iataCode: hotelData[i].iataCode
            }
          }
          results.push(displayData);
  
      }// close for loop    
      return res.send(results);
    }).catch(function (response) {
      res.json(err);
    });
  });
  module.exports = router;
