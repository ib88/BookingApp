/*console.log('hello');
   
var Amadeus = require("amadeus");
var amadeus = new Amadeus({
  clientId: 'al1mecQyGOFkltW6goBABPBeTzIOyM7n',
  clientSecret: 'aGqumP44UGDiOcTZ'
});

// Get list of Hotels by city code
amadeus.shopping.hotelOffers.get({
  cityCode: 'PAR'
}).then(function (response) {
  console.log(response);
}).catch(function (response) {
  console.error(response);
});*/
//var express = require('express');

//const { API_KEY, API_SECRET } = require("./config");
import { API_KEY, API_SECRET } from "./config";

import express from "express";

//var request = require('request');
import request from "request";

//var bodyParser = require('body-parser');
import bodyParser from "body-parser";

import fetch from "node-fetch";
//let fetch = await import('node-fetch');
const app = express();

import Amadeus from "amadeus";

const base = "https://test.api.amadeus.com";

// let headers= {  
//   'Content-Type': 'application/x-www-form-urlencoded',
// };

// let body = {
//  "grant_type": "client_credentials",
//  "client_id": "al1mecQyGOFkltW6goBABPBeTzIOyM7n",
//  "client_secret": "aGqumP44UGDiOcTZ",
// }

// fetch("/v3/security/oauth2/token", { method: 'POST', 
// headers: headers, 
// body: 'grant_type=client_credentials&client_id=' + body.client_id + '&client_secret=' + body.client_secret
// }).then(function(res) {
//   return res.json();
// }).then(function(body) {
//  console.log(body);
// });

/////version 2

/*app.get("/test", async (req, res) => {
  const data = await generateAccessTokenFetch();
  console.log(data);
  res.json(data);
});*/

// const data = await generateAccessTokenFetch();

// async function generateAccessTokenFetch() {
//   const response = await fetch(base + "/security/oauth2/token", {
//     method: "post",
//     body: "grant_type=client_credentials&client_id=al1mecQyGOFkltW6goBABPBeTzIOyM7n&client_secret=aGqumP44UGDiOcTZ",
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       //Authorization:
//         //"Basic " + Buffer.from("al1mecQyGOFkltW6goBABPBeTzIOyM7n" + ":" + "aGqumP44UGDiOcTZ").toString("base64"),
//         //'Content-Type': 'application/x-www-form-urlencoded',
//     },
//   });
//   const data = await response.json();
//   console.log(data);
//   return data;
// }


var amadeus = new Amadeus({
  clientId: 'al1mecQyGOFkltW6goBABPBeTzIOyM7n',
  clientSecret: 'aGqumP44UGDiOcTZ'
});

// Get list of offers for a specific hotel
amadeus.shopping.hotelOffers.get({
  cityCode: 'PAR'
}).then(function (hotels) {
  console.log('----------------------');
  console.log(hotels);
  return amadeus.shopping.hotelOffersByHotel.get({
    'hotelId': hotels.data[0].hotel.hotelId,
    'checkInDate': '2022-05-10',
    'checkOutDate': '2022-05-12'
  });
}).then(function (hotelRoomPricingOffers) {
  console.log('----------------------');
  //console.log(hotelRoomPricingOffers);
  //return amadeus.shopping.hotelOffer(hotelRoomPricingOffers.data.offers[0].id).get(); book the hotel
});
