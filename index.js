
// index.js
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require('express-session');
//const router = require("./router");
const hotelRouter = require("./controllers/Hotel_controller");
const flightRouter = require("./controllers/flight_controller");
const MoqflightRouter = require("./controllers/Mockflight_controller");

const config = require("./config");
const path = require("path");
var bodyParser = require("body-parser");
const app = express();

app.set('views', path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.static("public"));

// app.get('api/static/', function(req, res) {
//   res.sendFile(path.join(__dirname + '/client.js'));
// });
// app.get('Moqflight/static/', function(req, res) {
//   res.sendFile(path.join(__dirname + '/client.js'));
// });

app.use(express.static('views/static'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());
app.use(session({
    secret: "amar",
    saveUninitialized: true,
    resave: true
}));

const PORT = config.PORT;

// app.get("/test", function(req, res){
//   res.render('search');    
// });

app.use(express.json());
//app.use("/api", router);

app.get('/', (req, res) => {
  res.send('flight/flightOffer')
})
app.use("/api", hotelRouter);
app.use("/flight", flightRouter);
app.use("/Moqflight", MoqflightRouter);
app.use("/", flightRouter);



app.listen(PORT, () => {
  console.log(`Express is running on port ${PORT}`);
});