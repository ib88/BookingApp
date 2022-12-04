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
const { API_KEY, API_SECRET } = require("./config");
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
app.use(bodyParser.urlencoded({ extended: false }));
// Create router
const router = express.Router();
// Create Amadeus API client
const amadeus = new Amadeus({
    clientId: API_KEY,
    clientSecret: API_SECRET,
});
// Location search suggestions
router.get(`/welcome`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var cities = [
        { name: "London", "population": 8615246 },
        { name: "Berlin", "population": 3517424 },
        { name: "Madrid", "population": 3165235 },
        { name: "Rome", "population": 2870528 }
    ];
    var data = jp.query(cities, '$..name');
    //var users = JSON.parse(json);
    //users = users.filter(x=>x.age===40);
    res.send(data);
    //var response = _.where(users, {user: "a"});
    //res.json(JSON.parse(response.body));
    //res.send('hello my baby');
}));
// => [{user: "a", age: 20}]
// Querying hotels by city code
router.get(`/city-hotels`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cityCode, checkInDate, checkOutDate, adults, } = req.query;
        const response = yield amadeus.shopping.hotelOffers.get({
            cityCode,
            checkInDate,
            checkOutDate
        });
        //var result = jp.query(JSON.parse(response.body), '$.data[*].offers[?(@.checkInDate=="2022-04-25"&&@.checkOutDate=="2022-04-26")]');
        //var result = jp.query(JSON.parse(response.body), "$.data[*].offers[?(@.id=='XVMATWC86C')]");
        //var result = jp.query(JSON.parse(response.body), "$.data[*].hotel");
        //res.json(result); 
        res.json(JSON.parse(response.body));
    }
    catch (err) {
        res.json(err);
    }
}));
//search hotels by names
router.get(`/city-hotelsByname`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hotelName } = req.query;
        const response = yield amadeus.shopping.hotelOffers.get({
            hotelName
        });
        //var result = jp.query(JSON.parse(response.body), '$.data[*].offers[?(@.checkInDate=="2022-04-25"&&@.checkOutDate=="2022-04-26")]');
        //var result = jp.query(JSON.parse(response.body), "$.data[*].offers[?(@.id=='XVMATWC86C')]");
        //var result = jp.query(JSON.parse(response.body), "$.data[*].hotel");
        //res.json(result); 
        res.json(JSON.parse(response.body));
    }
    catch (err) {
        res.json(err);
    }
}));
// Querying hotel offers By hotel ID
router.get(`/hotel-offers`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hotelId } = req.query;
        const response = yield amadeus.shopping.hotelOffersByHotel.get({
            hotelId,
        });
        var result = jp.query(JSON.parse(response.body), "$.data[*]");
        //result = jp.query(JSON.parse(response.body), "$.[*]");
        res.json(result);
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
            subType: 'CITY,AIRPORT'
        });
        console.log('searching loc...');
        var result = jp.query(JSON.parse(response.body), '$.data[*]');
        res.json(result);
        //res.json(JSON.parse(response.body));
    }
    catch (err) {
        res.json(err);
    }
}));
// Booking
router.post(`/book-hotel`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { guests, payments, offerId } = req.body;
        const response = yield amadeus.booking.hotelBookings.post(JSON.stringify({
            data: {
                offerId,
                guests,
                payments,
            },
        }));
        res.json(JSON.parse(response.body));
    }
    catch (err) {
        res.json(err);
    }
}));
module.exports = router;
//# sourceMappingURL=router.js.map