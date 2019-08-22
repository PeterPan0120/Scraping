const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "vehicles"
});

const crons = require("./controller/crons");

const app = express();

// Bodyparser Middleware
app.use(bodyParser.json());

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT ads.*, vehicles.vehicle FROM ads JOIN vehicles ON ads.vehicle=vehicles.id WHERE published=0", function (err, result, fields) {
    if (err) throw err;
    //console.log(result);
    crons.prepareCron(con, result);
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server started on port " + port));
