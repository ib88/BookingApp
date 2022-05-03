

// index.js
const express = require("express");
const router = require("./router");
const config = require("./config");
const path = require("path");
var bodyParser = require("body-parser");
const app = express();

app.set('views', path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const PORT = config.PORT;

app.get("/test", function(req, res){
  res.render('search');    
});

app.use(express.json());
app.use("/api", router);



app.listen(PORT, () => {
  console.log(`Express is running on port ${PORT}`);
});