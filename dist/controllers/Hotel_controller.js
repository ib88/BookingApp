"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// router.js
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
});
// Location search suggestions
router.get(`/autosuggest`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.render("autoSuggest");
    }
    catch (err) {
        res.json(err);
    }
}));
router.get(`/homepage`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.render("home");
    }
    catch (err) {
        res.json(err);
    }
}));
router.get(`/getSuggestion`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var results = [];
        //var testCode = hotelData[i].address.cityCode;
        //console.log("FULL DATA OBJ: ", hotelData);
        for (var i = 2; i < dataCount; i++) {
            if (typeof hotelData[i] != 'undefined') {
                var displayData = {
                    detailedName: hotelData[i].detailedName,
                    name: hotelData[i].name,
                    subType: hotelData[i].subType,
                    iataCode: hotelData[i].iataCode,
                    cityCode: hotelData[i].address.cityCode
                };
                //console.log('searching loc...',hotelData[i].geoCode);
            }
            results.push(displayData);
        } // close for loop    
        return res.send(results);
    }).catch(function (response) {
        res.json(response);
    });
}));
router.get(`/autosearch`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword, pageLimit, pageOffset } = req.query;
        //const { keyword } = req.query;
        const response = yield amadeus.referenceData.locations.get({
            keyword,
            'page[limit]': pageLimit,
            'page[offset]': pageOffset,
            subType: 'CITY,AIRPORT'
        });
        //console.log('searching loc...');
        var result = jp.query(JSON.parse(response.body), '$.data[*]');
        var hotelData = jp.query(JSON.parse(response.body), '$[*][*]');
        var dataCount = hotelData.length;
        var results = [];
        for (var i = 0; i < dataCount; i++) {
            // console.log("FULL DATA OBJ: ", newData)
            var displayData = {
                detailedName: hotelData[i].detailedName,
                name: hotelData[i].name,
                subType: hotelData[i].subType,
                cityName: hotelData[i].cityName
            };
            results.push(displayData);
        } // close for loop    
        return res.render("autosearch", { business: results });
        //res.json(JSON.parse(response.body));
    }
    catch (err) {
        res.json(err);
    }
}));
// Querying hotels by city code
router.get(`/city-hotels`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cityCode, checkInDate, checkOutDate, adults, priceRange, pageLimit } = req.query;
    if (!cityCode || !checkInDate || !checkOutDate || !adults) {
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
        for (var i = 0; i < dataCount; i++) {
            //console.log("FULL DATA OBJ: ", hotelData[i].hotel.name);
            var displayData = {
                name: hotelData[i].hotel.name,
                city: hotelData[i].hotel.address.cityName,
                hotelId: hotelData[i].hotel.hotelId,
                distance: hotelData[i].hotel.hotelDistance.distance,
                roomType: hotelData[i].offers[0].room.typeEstimated.category,
                price: hotelData[i].offers[0].price.total
            };
            results.push(displayData);
        } // close for loop
        return res.render("home", { business: results });
    }).catch(function (response) {
        res.json(response);
    });
}));
router.post(`/city-hotels`, [
    check('destination1')
        .not()
        .isEmpty()
        .withMessage('Chose a destination'),
    check('datepicker1')
        .not()
        .isEmpty()
        .withMessage('Chose a check in date'),
    check('datepicker2')
        .not()
        .isEmpty()
        .withMessage('Chose a check out date')
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var cityCode = req.body.destinationCode;
    var checkInDate = req.body.datepicker1;
    var checkOutDate = req.body.datepicker2;
    var adults = req.body.adults;
    // if(!cityCode || !checkInDate || !checkOutDate || !adults) {
    //   return res.render("home", { business: [] });
    // }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alert = errors.array();
        return res.render("home", { alert });
        //return res.status(422).jsonp(errors.array());
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
        for (var i = 0; i < dataCount; i++) {
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
            };
            results.push(displayData);
        } // close for loop
        return res.render("home", { business: results });
    }).catch(function (response) {
        // TODO: When an error occurs during booking, don't just display JSON googledigoo, 
        // ... display page with comprehensible error to user
        res.json(response);
    });
}));
// BOOK A HOTEL
router.get(`/Book-hotel`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { offerId } = req.query;
    amadeus.booking.hotelBookings.post(JSON.stringify({
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
        console.log(response);
        res.json(response);
    });
}));
//search hotels by names
router.get(`/city-hotelsByname`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hotelName } = req.query;
        const response = yield amadeus.shopping.hotelOffers.get({
            hotelName
        });
        res.json(JSON.parse(response.body));
    }
    catch (err) {
        res.json(err);
    }
}));
// Querying hotel offers By hotel ID
router.get(`/hotel-offers`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hotelId, checkInDate, checkOutDate, adults } = req.query;
        const response = yield amadeus.shopping.hotelOffersByHotel.get({
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
            };
            //console.log(displayData);
            //if(displayData.price>=200&&displayData.price<=900)
            results.push(displayData);
            //console.log("DISPLAY DATA: ", displayData);
            // var handlebarsData = ;
        } // close for loop
        return res.render("hotelOffers", { business: results });
    }
    catch (err) {
        res.json(err);
    }
}));
// Get hotel offer details
router.get(`/hotel-offer`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { offerId } = req.query;
        const response = yield amadeus.shopping.hotelOffer(offerId).get();
        res.json(JSON.parse(response.body));
    }
    catch (err) {
        res.json(err);
    }
}));
// city and airport search suggestions according to keyword
router.get(`/search-location`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword, pageLimit, pageOffset } = req.query;
        const response = yield amadeus.referenceData.locations.get({
            keyword,
            'page[limit]': pageLimit,
            'page[offset]': pageOffset,
            subType: 'CITY,AIRPORT'
        });
        //console.log('searching loc...');
        var result = jp.query(JSON.parse(response.body), '$.data[*]');
        var hotelData = jp.query(JSON.parse(response.body), '$[*][*]');
        var dataCount = hotelData.length;
        var results = [];
        for (var i = 0; i < dataCount; i++) {
            // console.log("FULL DATA OBJ: ", newData)
            var addressVar = hotelData[i].address;
            //var cityCodeVar = hotelData[i].address.cityCode;
            console.log("FULL DATA OBJ: ", cityCodeVar);
            var displayData = {
                detailedName: hotelData[i].detailedName,
                name: hotelData[i].name,
                subType: hotelData[i].subType,
                //cityName: hotelData[i].address
            };
            results.push(displayData);
        } // close for loop    
        res.json(results);
        //res.json(JSON.parse(response.body));
    }
    catch (err) {
        res.json(err);
    }
}));
module.exports = router;
//# sourceMappingURL=Hotel_controller.js.map