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
//# sourceMappingURL=book_controller.js.map