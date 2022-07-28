
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

router.get(`/autosuggest`, async (req, res) => {
  try {

    return res.render("autoSuggest");

  } catch (err) {
    res.json(err);
  }
});

router.get(`/getSuggestion`, async (req, res) => {
  
  try {
      //const { keyword, pageLimit, pageOffset } = req.query;
      const { keyword } = req.query;
      const response = await amadeus.referenceData.locations.get({
        keyword,
        'page[limit]': 5,
        'page[offset]': 0,
        subType: 'CITY,AIRPORT'
      });
      //console.log('searching loc...');
      
      var result = jp.query(JSON.parse(response.body), '$.data[*]');
      var hotelData = jp.query(JSON.parse(response.body), '$[*][*]');
  
      var dataCount = hotelData.length;
      var results = []
      for (var i = 0; i < dataCount; i++){
  
          // console.log("FULL DATA OBJ: ", newData)
          if (typeof hotelData[i]!='undefined'){
          var displayData = {
              detailedName: hotelData[i].detailedName,
              name: hotelData[i].name,
              subType: hotelData[i].subType,
              cityName: hotelData[i].cityName
            }
          }
          results.push(displayData);
  
      }// close for loop    
      return res.send(results);
      //return res.render("autosearch", {business: results});  
      //res.json(JSON.parse(response.body));
  
    }
      catch (err) {
        res.json(err);
      }
});


router.get(`/autosearch`, async (req, res) => {
  
    try {
        const { keyword, pageLimit, pageOffset } = req.query;
        //const { keyword } = req.query;
        const response = await amadeus.referenceData.locations.get({
          keyword,
          'page[limit]': pageLimit,
          'page[offset]': pageOffset,
          subType: 'CITY,AIRPORT'
        });
        //console.log('searching loc...');
        
        var result = jp.query(JSON.parse(response.body), '$.data[*]');
        var hotelData = jp.query(JSON.parse(response.body), '$[*][*]');
    
        var dataCount = hotelData.length;
        var results = []
        for (var i = 0; i < dataCount; i++){
    
            // console.log("FULL DATA OBJ: ", newData)
            
            var displayData = {
                detailedName: hotelData[i].detailedName,
                name: hotelData[i].name,
                subType: hotelData[i].subType,
                cityName: hotelData[i].cityName
            }
            results.push(displayData);
    
        }// close for loop    
        
        return res.render("autosearch", {business: results});  
        //res.json(JSON.parse(response.body));
    
      }
        catch (err) {
          res.json(err);
        }
});


// Querying hotels by city code

router.get(`/city-hotels`, async (req, res) => {
  try {
    const { cityCode,checkInDate,checkOutDate,adults,pageLimit} = req.query;

    const response = await amadeus.shopping.hotelOffers.get({
      cityCode,
      checkInDate,
      checkOutDate,
      adults,
      pageLimit
    });
    var hotelData = jp.query(JSON.parse(response.body), "$.data[*]");
    var dataCount = hotelData.length;
    //console.log("DATA COUNT:", dataCount);
    //console.log("FULL DATA OBJ: ", hotelData[0].offers[0].room.typeEstimated.category);
    
    var results = [];
    for (var i = 0; i < dataCount; i++){

        // console.log("FULL DATA OBJ: ", newData)
        
        var displayData = {
            name: hotelData[i].hotel.name,
            distance: hotelData[i].hotel.hotelDistance.distance,
            roomType: hotelData[i].offers[0].room.typeEstimated.category,
            price: hotelData[i].offers[0].price.total
        }
        results.push(displayData);
        //console.log("DISPLAY DATA: ", displayData);
        // var handlebarsData = ;


    }// close for loop

    return res.render("hotel", {business: results});

  } catch (err) {
    res.json(err);
  }
});

//search hotels by names
router.get(`/city-hotelsByname`, async (req, res) => {
  try {
    const {hotelName} = req.query;

    const response = await amadeus.shopping.hotelOffers.get({
      hotelName
    });

    //var result = jp.query(JSON.parse(response.body), '$.data[*].offers[?(@.checkInDate=="2022-04-25"&&@.checkOutDate=="2022-04-26")]');
    //var result = jp.query(JSON.parse(response.body), "$.data[*].offers[?(@.id=='XVMATWC86C')]");
   //var result = jp.query(JSON.parse(response.body), "$.data[*].hotel");

    //res.json(result); 

    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});

// Querying hotel offers By hotel ID
router.get(`/hotel-offers`, async (req, res) => {
  try {
    const { hotelId } = req.query;
    const response = await amadeus.shopping.hotelOffersByHotel.get({
      hotelId,
    });
    var result = jp.query(JSON.parse(response.body), "$.data[*]");
    //result = jp.query(JSON.parse(response.body), "$.[*]");
    res.json(result); 
  } catch (err) {
    res.json(err);
  }
});

// Get hotel offer details
router.get(`/hotel-offer`, async (req, res) => {
  try {
    const { offerId } = req.query;
    const response = await amadeus.shopping.hotelOffer(offerId).get();
    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});

// city and airport search suggestions according to keyword
router.get(`/search-location`, async (req, res) => {
  try {
    const { keyword, pageLimit, pageOffset } = req.query;
    const response = await amadeus.referenceData.locations.get({
      keyword,
      'page[limit]': pageLimit,
      'page[offset]': pageOffset,
      subType: 'CITY,AIRPORT'
    });
    //console.log('searching loc...');
    
    var result = jp.query(JSON.parse(response.body), '$.data[*]');
    var hotelData = jp.query(JSON.parse(response.body), '$[*][*]');

    var dataCount = hotelData.length;
    var results = []
    for (var i = 0; i < dataCount; i++){

        // console.log("FULL DATA OBJ: ", newData)
        
        var displayData = {
            detailedName: hotelData[i].detailedName,
            name: hotelData[i].name,
            subType: hotelData[i].subType,
            cityName: hotelData[i].cityName
        }
        results.push(displayData);

    }// close for loop    
    
    res.json(results);   
    //res.json(JSON.parse(response.body));

  }
    catch (err) {
      res.json(err);
    }
});



module.exports = router;