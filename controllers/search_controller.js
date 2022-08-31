
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

        // console.log("FULL DATA OBJ: ", newData)
        // console.log("FULL DATA OBJ: ", newData)
        //var addressVar = hotelData[i].address.stateCode;
        //var cityCodeVar = hotelData[i].address;
         //console.log("FULL DATA OBJ: ", addressVar)
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


  //////////
  
  // try {
    
  //     //const { keyword, pageLimit, pageOffset } = req.query;
  //     const { keyword } = req.query;
  //     const response = await amadeus.referenceData.locations.get({
  //       keyword,
  //       'page[limit]': 5,
  //       'page[offset]': 0,
  //       subType: Amadeus.location.any
  //       //subType: 'CITY,AIRPORT'
  //     });
  //     //console.log('searching loc...');
      
  //     var result = jp.query(JSON.parse(response.body), '$.data[*]');
  //     var hotelData = jp.query(JSON.parse(response.body), '$[*][*]');
  
  //     var dataCount = hotelData.length;
  //     var results = []
  //     for (var i = 0; i < dataCount; i++){
  
  //         // console.log("FULL DATA OBJ: ", newData)
  //         if (typeof hotelData[i]!='undefined'){
  //         var displayData = {
  //             detailedName: hotelData[i].detailedName,
  //             name: hotelData[i].name,
  //             subType: hotelData[i].subType,
  //             iataCode: hotelData[i].address.cityCode,
  //           }
  //           //console.log('searching loc...',hotelData[i].address.cityName);
  //         }
  //         results.push(displayData);
  
  //     }// close for loop    
  //     return res.send(results);
  
  //   }
  //     catch (err) {
  //       res.json(err);
  //     }
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
        //console.log("DISPLAY DATA:", displayData);
        // var handlebarsData = ;
    }// close for loop
    //console.log("DISPLAY DATA: ", results);
     //res.json(JSON.parse(response.body));
   return res.render("home", {business: results});

    }).catch(function (response) {
      res.json(err);
    });
});



router.post(`/city-hotels`, async (req, res) => {
  
  //const { cityCode,checkInDate,checkOutDate,adults,priceRange,pageLimit} = req.query;
  var cityCode = req.body.destinationCode;
  //var cityCode = "LON";
  //console.log("City Code: ", cityCode);
  //console.log("City Code: ", req.body);
  //var checkInDate = '2022-08-31';
  var checkInDate = req.body.datepicker1;
  //var checkOutDate = '2022-09-01';
  var checkOutDate = req.body.datepicker2;

  var adults = req.body.adults;;
  //console.log("adults:", adults);


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
      //console.log("DISPLAY DATA:", displayData);
      // var handlebarsData = ;
  }// close for loop
  //console.log("DISPLAY DATA: ", results);
   //res.json(JSON.parse(response.body));
 return res.render("home", {business: results});

  }).catch(function (response) {
    res.json(err);
  });
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
    const { hotelId,checkInDate, checkOutDate,adults} = req.query;
    const response = await amadeus.shopping.hotelOffersByHotel.get({
      hotelId,
      checkInDate,
      checkOutDate,
      adults
    });

    // const response = await amadeus.referenceData.locations.hotels.byHotels.get({
    //   hotelIds: 'EDLONDER'
    // });

    //get the hotel infos such as geographical position, citycode, cityname
    var hotelInfos = jp.query(JSON.parse(response.body), "$.data.hotel");
    //get only the offers
    var hotelOffers = jp.query(JSON.parse(response.body), "$.data.offers[*]");
    var offerCount = hotelOffers.length;
    //console.log("DATA COUNT:", offerCount);
    //console.log("FULL DATA OBJ: ", hotelData[0].offers[0].room.typeEstimated.category);
    
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
    //res.json(JSON.parse(response.body));
    //res.json(results); 

    //result = jp.query(JSON.parse(hotelData.body), "$.[*]");
    //res.json(results); 
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

//////////////FLIGHT SEARCH
router.get(`/flightsearch`, async (req, res) => {
  try {

    // Find the cheapest flights from SYD to BKK
    const response = amadeus.shopping.flightOffersSearch.get({
    originLocationCode: 'SYD',
    destinationLocationCode: 'BKK',
    departureDate: '2022-05-21',
    adults: '1'
  });

  res.json(JSON.parse(response.body));

  } catch (err) {
    res.json(err);
  }
});



module.exports = router;