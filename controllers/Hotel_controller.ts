
// router.js
const { AmadeusHotelRepo, AmadeusMockRepo } = require("../Repositories/IAmadeusHotelRepo");
import { ObjectMapper } from "jackson-js";
import { hotelInfos, hotelOffer } from "../Models/hotelOffer";

//import { AmadeusHotelMockRepo } from "../Repositories/IAmadeusHotelRepo";
const { API_KEY, API_SECRET } = require("../config");
const Amadeus = require("amadeus");
const express = require("express");
const axios = require("axios");
var _ = require("underscore");
const { check, validationResult } = require('express-validator');
//const path = require("path");
var bodyParser = require("body-parser");
var jp = require('jsonpath');
const { addListener } = require("nodemon");

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create router
const router = express.Router();
// Create Amadeus API client
const amadeus = new Amadeus({
  clientId: API_KEY,
  clientSecret: API_SECRET,
  hostname: 'production'
});


const objectMapper = new ObjectMapper();
const amadeusHotelRepo = new AmadeusHotelRepo();



// Location search suggestions
router.get(`/autosuggest`, async (req: any, res: any) => {
  try {

    return res.render("autoSuggest");

  } catch (err) {
    res.json(err);
  }
});

router.get(`/homepage`, async (req: any, res: any) => {
  try {

    return res.render("home");

  } catch (err) {
    res.json(err);
  }
});

router.get(`/getSuggestion`, async (req: any, res: any) => {

  const { keyword } = req.query;

  amadeus.referenceData.locations.get({
    keyword,
    'page[limit]': 5,
    'page[offset]': 0,
    subType: Amadeus.location.any
    //subType: 'CITY,AIRPORT'
  })
    .then(function (response: any) {
      var result = jp.query(JSON.parse(response.body), '$.data[*]');
      var hotelData = jp.query(JSON.parse(response.body), '$[*][*]');

      var dataCount = hotelData.length;
      var results = []
      //var testCode = hotelData[i].address.cityCode;
      //console.log("FULL DATA OBJ: ", hotelData);
      var displayData;
      for (var i = 2; i < dataCount; i++) {
        if (typeof hotelData[i] != 'undefined') {
          displayData = {
            detailedName: hotelData[i].detailedName,
            name: hotelData[i].name,
            subType: hotelData[i].subType,
            iataCode: hotelData[i].iataCode,
            cityCode: hotelData[i].address.cityCode
          }
          //console.log('searching loc...',hotelData[i].geoCode);
        }
        results.push(displayData);

      }// close for loop    
      return res.send(results);
    }).catch(function (response: any) {
      res.json(response);
    });
});


router.get(`/autosearch`, async (req: any, res: any) => {

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
    for (var i = 0; i < dataCount; i++) {

      // console.log("FULL DATA OBJ: ", newData)

      var displayData = {
        detailedName: hotelData[i].detailedName,
        name: hotelData[i].name,
        subType: hotelData[i].subType,
        cityName: hotelData[i].cityName
      }
      results.push(displayData);

    }// close for loop    

    return res.render("autosearch", { business: results });
    //res.json(JSON.parse(response.body));

  }
  catch (err) {
    res.json(err);
  }
});


router.get(`/city-hotels`, async (req: any, res: any) => {

  const { destination, checkInDate, checkoutDate, rooms } = req.query;
  if (!destination || !checkInDate || !checkoutDate || !rooms) {
    return res.render("flights", { business: [], hotels: [] });
  }
  return res.render("flights", { business: null, hotels: null });
});


router.post(`/city-hotels`, [
  check('destinationHotel')
    .not()
    .isEmpty()
    .withMessage('Chose a destination'),
  check('checkin')
    .not()
    .isEmpty()
    .withMessage('Chose a check in date'),
  check('checkout')
    .not()
    .isEmpty()
    .withMessage('Chose a check out date')
], async (req: any, res: any) => {

  var cityCode = req.body.destinationHotelCode;
  var checkInDate = req.body.checkin;
  var checkOutDate = req.body.checkout;
  //var adults = req.body.hotelAdults;
  var rooms = req.body.rooms;


  // if(!cityCode || !checkInDate || !checkOutDate || !adults) {
  //   return res.render("home", { business: [] });
  // }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const alert = errors.array()
    return res.render("home", { alert });
    //return res.status(422).jsonp(errors.array());
  }

  try {
    let hotels = undefined;
    hotels = await amadeusHotelRepo.getHotelOffers(cityCode, checkInDate, checkOutDate, rooms);

    if (!hotels || hotels == undefined || hotels == null) {
      //return res.render("error.ejs", { alert: "the hotel might have been booked already!" });
      return res.render("flights", { business: undefined });
    }

    if (hotels.length == 0) {
      return res.render("flights", { business: undefined, hotels: undefined });
    }
    return res.render("flights", { anchor: '#flight-results', business: undefined, hotels: hotels, apiError: undefined, alert: undefined });
  }
  catch (err: any) {
    return res.render("flights.ejs", { alert: undefined, apiError: "Something went wrong. Please try again.", business: undefined, hotels: undefined });
  }
});

router.get(`/bookHotel`, async (req: any, res: any) => {

  const { hotel, hotelName } = req.query;
  req.session.hotelJson = hotel;
  //req.session.flight = flight;
  req.session.save();
  try {

    let hotelParsed = objectMapper.parse<hotelOffer>(hotel, { mainCreator: () => [hotelOffer] });

    //compute the departure and arrival time of the whole flight by summing up the times for individual flight segments
    let carrierResult = undefined;
    let airlineCode = undefined;

    let returnResults = undefined;

    req.session.hotelJson = hotel;
    hotelParsed.hotelName_ = hotelName;
    req.session.hotelParsed = hotelParsed;

    return res.render("bookingHotel_step1.ejs", { hotel: hotelParsed });
  }
  catch (err: any) {
    return res.render("flights.ejs", { business: undefined, apiError: "Error loading the flight. Please try again!" });
  }

});

router.get(`/bookHotel`, async (req: any, res: any) => {

  const { hotel, hotelName } = req.query;
  req.session.hotelJson = hotel;
  //req.session.flight = flight;
  req.session.save();
  try {

    let hotelParsed = objectMapper.parse<hotelOffer>(hotel, { mainCreator: () => [hotelOffer] });

    //compute the departure and arrival time of the whole flight by summing up the times for individual flight segments
    let carrierResult = undefined;
    let airlineCode = undefined;

    let returnResults = undefined;

    req.session.hotelJson = hotel;
    hotelParsed.hotelName_ = hotelName;
    req.session.hotelParsed = hotelParsed;

    return res.render("bookingHotel_step1.ejs", { hotel: hotelParsed });
  }
  catch (err: any) {
    return res.render("flights.ejs", { business: undefined, apiError: "Error loading the flight. Please try again!" });
  }

});

// BOOK A HOTEL
router.post(`/bookHotel`, [
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

  let hotelParsed: hotelOffer;
  let alert = undefined;

  if (req.session.hotelParsed)
    hotelParsed = req.session.hotelParsed;
  else
    return res.render("flights.ejs", { business: undefined, apiError: "Error loading the Hotel. Please try again!" });

  //let flightParsed = objectMapper.parse < FlightOffer > (flight, { mainCreator: () => [FlightOffer] });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    alert = errors.array()
    return res.render("bookingHotel_step1.ejs", { alert, flight: undefined, hotel: hotelParsed });
  }
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let birthDate = req.body.birthDate;
  let gender = "MALE";
  let email = req.body.email;
  let traveler = undefined;
  let cardNumber = req.body.cardNumber;
  let expiryDate = req.body.expiryDate;
  let CsvCode = req.body.CsvCode;



  traveler = {
    first_name: firstName,
    last_name: lastName,
    email_: email,
    cardNumber: cardNumber,
    expiryDate: expiryDate,
    CsvCode: CsvCode
  };
  let bookingResult;

  try {
    bookingResult = await amadeusHotelRepo.bookHotel(traveler, hotelParsed);

  } catch (e: any) {
    return res.render("flights.ejs", { alert: undefined, apiError: "The Hotel offer might have been taken already!", business: undefined, hotels: undefined });
    //return res.render("error.ejs", { alert: "the flihgt might have been booked already!" });
  }
  req.session.bookingResult = bookingResult;
  req.session.traveler = traveler;

  // if (req.session.bookingResult && req.session.hotelParsed && req.session.traveler)
  return res.render("bookingHotel_step3.ejs", { result: req.session.bookingResult, hotel: req.session.hotelParsed, travelerInfos: req.session.traveler });

});


//search hotels by names
router.get(`/city-hotelsByname`, async (req: any, res: any) => {
  try {
    const { hotelName } = req.query;

    const response = await amadeus.shopping.hotelOffers.get({
      hotelName
    });
    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});

// Querying hotel offers By hotel ID
router.get(`/hotel-offers`, async (req: any, res: any) => {
  try {
    const { hotelId, checkInDate, checkOutDate, adults } = req.query;
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
    for (var i = 0; i < offerCount; i++) {

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
    return res.render("hotelOffers", { business: results });
  } catch (err) {
    res.json(err);
  }
});

// Get hotel offer details
router.get(`/hotel-offer`, async (req: any, res: any) => {
  try {
    const { offerId } = req.query;
    const response = await amadeus.shopping.hotelOffer(offerId).get();
    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});

// city and airport search suggestions according to keyword
// router.get(`/search-location`, async (req:any, res:any) => {
//   try {
//     const { keyword, pageLimit, pageOffset } = req.query;
//     const response = await amadeus.referenceData.locations.get({
//       keyword,
//       'page[limit]': pageLimit,
//       'page[offset]': pageOffset,
//       subType: 'CITY,AIRPORT'
//     });
//     //console.log('searching loc...');

//     var result = jp.query(JSON.parse(response.body), '$.data[*]');
//     var hotelData = jp.query(JSON.parse(response.body), '$[*][*]');

//     var dataCount = hotelData.length;
//     var results = []
//     for (var i = 0; i < dataCount; i++){

//         // console.log("FULL DATA OBJ: ", newData)
//         var addressVar = hotelData[i].address;
//         //var cityCodeVar = hotelData[i].address.cityCode;
//         console.log("FULL DATA OBJ: ", cityCodeVar);
//         var displayData = {
//             detailedName: hotelData[i].detailedName,
//             name: hotelData[i].name,
//             subType: hotelData[i].subType,
//             //cityName: hotelData[i].address
//         }
//         results.push(displayData);

//     }// close for loop    

//     res.json(results);   
//     //res.json(JSON.parse(response.body));

//   }
//     catch (err) {
//       res.json(err);
//     }
// });

module.exports = router;