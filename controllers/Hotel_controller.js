
// router.js
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

// Location search suggestions

router.get(`/autosuggest`, async (req, res) => {
  try {

    return res.render("autoSuggest");

  } catch (err) {
    res.json(err);
  }
});

router.get(`/homepage`, async (req, res) => {
  try {

    return res.render("home");

  } catch (err) {
    res.json(err);
  }
});

router.get(`/getSuggestion`, async (req, res) => {

  const { keyword } = req.query;

  amadeus.referenceData.locations.get({
        keyword,
        'page[limit]': 5,
        'page[offset]': 0,
        subType: Amadeus.location.any
        //subType: 'CITY,AIRPORT'
      })
  .then(function (response) {
    var result = jp.query(JSON.parse(response.body), '$.data[*]');
    var hotelData = jp.query(JSON.parse(response.body), '$[*][*]');

    var dataCount = hotelData.length;
    var results = []
    console.log("FULL DATA OBJ: ", hotelData);

    for (var i = 0; i < dataCount; i++){
        if (typeof hotelData[i]!='undefined'){
        var displayData = {
            detailedName: hotelData[i].detailedName,
            name: hotelData[i].name,
            subType: hotelData[i].subType,
            iataCode: hotelData[i].iataCode
          }
            console.log('searching loc...',hotelData[i].geoCode);
        }
        results.push(displayData);

    }// close for loop    
    return res.send(results);
  }).catch(function (response) {
    res.json(err);
  });
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
  
    const { cityCode,checkInDate,checkOutDate,adults,priceRange,pageLimit} = req.query;
    if(!cityCode || !checkInDate || !checkOutDate || !adults) {
      return res.render("home", { business: [] });
    }

    amadeus.shopping.hotelOffers.get({
      cityCode,
      checkInDate,
      checkOutDate,
      adults
    }).then(function (response) 
    {
        var hotelData = jp.query(JSON.parse(response.body), "$.data[*]");
        var dataCount = hotelData.length;
        var results = [];
        for (var i = 0; i < dataCount; i++){

            //console.log("FULL DATA OBJ: ", hotelData[i].hotel.name);
            
            var displayData = {
                name: hotelData[i].hotel.name,
                city: hotelData[i].hotel.address.cityName,
                hotelId: hotelData[i].hotel.hotelId,
                distance: hotelData[i].hotel.hotelDistance.distance,
                roomType: hotelData[i].offers[0].room.typeEstimated.category,
                price: hotelData[i].offers[0].price.total
            }
            results.push(displayData);
        }// close for loop
      return res.render("home", {business: results});
    }).catch(function (response) {
      res.json(response);
    });
});



router.post(`/city-hotels`, async (req, res) => {

  var cityCode = req.body.destinationCode;
  var checkInDate = req.body.datepicker1;
  var checkOutDate = req.body.datepicker2;
  var adults = req.body.adults;

  if(!cityCode || !checkInDate || !checkOutDate || !adults) {
    return res.render("home", { business: [] });
  }


  amadeus.shopping.hotelOffers.get({
    cityCode,
    checkInDate,
    checkOutDate,
    adults
  }).then(function (response) {
    var hotelData = jp.query(JSON.parse(response.body), "$.data[*]");
    var dataCount = hotelData.length;
    var results = [];
    for (var i = 0; i < dataCount; i++){
        //console.log("Chek In Date: ", hotelData[i].offers[0].checkInDate);
        var displayData = {
            name: hotelData[i].hotel.name,
            city: hotelData[i].hotel.address.cityName,
            hotelId: hotelData[i].hotel.hotelId,
            distance: hotelData[i].hotel.hotelDistance.distance,
            roomType: hotelData[i].offers[0].room.typeEstimated.category,
            price: hotelData[i].offers[0].price.total,
            checkInDate: hotelData[i].offers[0].checkInDate,
            checkOutDate: hotelData[i].offers[0].checkOutDate,
            adults: adults
        }
        results.push(displayData);
    }// close for loop
    return res.render("home", {business: results});
  }).catch(function (response) {
    // TODO: When an error occurs during booking, don't just display JSON googledigoo, 
    // ... display page with comprehensible error to user
    res.json(response);
  });
});

// BOOK A HOTEL
router.get(`/Book-hotel`, async (req, res) => {
  
  const {offerId} = req.query;

    amadeus.booking.hotelBookings.post(
      JSON.stringify({
        'data': {
          'offerId': offerId,
          'guests': [{
            'id': 1,
            'name': {
              'title': 'MR',
              'firstName': 'BOB',
              'lastName': 'SMITH'
            },
            'contact': {
              'phone': '+33679278416',
              'email': 'bob.smith@email.com'
            }
          }],
          'payments': [{
            'id': 1,
            'method': 'creditCard',
            'card': {
              'vendorCode': 'VI',
              'cardNumber': '4151289722471370',
              'expiryDate': '2022-09'
            }
          }]
        }
      })).then(function (response) {
        console.log(response);
    }).catch(function (response) {
      console.log("MY ERROR \n"); 
      console.log(response)
      res.json(response);
    });
});


//search hotels by names
router.get(`/city-hotelsByname`, async (req, res) => {
  try {
    const {hotelName} = req.query;

    const response = await amadeus.shopping.hotelOffers.get({
      hotelName
    });
    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});

// Querying hotel offers By hotel ID
router.get(`/hotel-offers`, async (req, res) => {
  try {
    const { hotelId,checkInDate, checkOutDate,adults} = req.query;
    const response = await amadeus.shopping.hotelOffersByHotel.get({
      hotelId,
      checkInDate,
      checkOutDate,
      adults
    });
    //get the hotel infos such as geographical position, citycode, cityname
    var hotelInfos = jp.query(JSON.parse(response.body), "$.data.hotel");
    //get only the offers
    var hotelOffers = jp.query(JSON.parse(response.body), "$.data.offers[*]");
    var offerCount = hotelOffers.length;
     var results = [];
    for (var i = 0; i < offerCount; i++){

        // console.log("FULL DATA OBJ: ", newData)
        
        var displayData = {
            Id: hotelOffers[i].id,
            rateCode: hotelOffers[i].rateCode,
            roomType: hotelOffers[i].room.type,
            category: hotelOffers[i].room.typeEstimated.category,
            bedsCount: hotelOffers[i].room.typeEstimated.beds,
            bedType: hotelOffers[i].room.typeEstimated.bedType,
            description: hotelOffers[i].room.description.text,
            guests: hotelOffers[i].guests.adults,
            price: hotelOffers[i].price.total
        }
        //console.log(displayData);
        //if(displayData.price>=200&&displayData.price<=900)
        results.push(displayData);
        //console.log("DISPLAY DATA: ", displayData);
        // var handlebarsData = ;

    }// close for loop
    return res.render("hotelOffers", {business: results});
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
        var addressVar = hotelData[i].address;
        //var cityCodeVar = hotelData[i].address.cityCode;
        console.log("FULL DATA OBJ: ", cityCodeVar);
        var displayData = {
            detailedName: hotelData[i].detailedName,
            name: hotelData[i].name,
            subType: hotelData[i].subType,
            //cityName: hotelData[i].address
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