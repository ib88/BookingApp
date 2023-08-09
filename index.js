
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

app.use("/hotel", hotelRouter);
app.use("/flight", flightRouter);
app.use("/Moqflight", MoqflightRouter);
app.get('/faqs', async (req, res) => {
  return res.render("faqs");
});
app.get('/inedex', async (req, res) => {
  return res.render("index");
});
app.get('/about', async (req, res) => {
  return res.render("about");
});
app.get('/contact', async (req, res) => {
  return res.render("contact");
});
app.get('/terms', async (req, res) => {
  return res.render("terms");
});
app.get('/career', async (req, res) => {
  return res.render("career");
});
app.get('/sustainability', async (req, res) => {
  return res.render("sustainability");
});
app.get('/media', async (req, res) => {
  return res.render("media");
});


app.get('/', (req, res) =>{
  res.redirect('/flight/');
 });

// app.use("/", flightRouter);
// app.get('/', function (req, res) {
//   res.send('hello world')
// });
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});


app.listen(PORT, () => {
  console.log(`Express is running on port ${PORT}`);
});