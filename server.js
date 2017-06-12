var express = require("express");
var path = require("path");
var http = require("http");

var app = express();

require('dotenv').config({ path: 'variables.env' });


app.get("/", function(req, res) {

  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get("/new/:newentry", function(req, res) {
  console.log(process.env.MONGODB_URI || process.env.DATABASE);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    "original_url": req.params.newentry
  }));
});

var port = process.env.PORT || 1337;
http.createServer(app).listen(port);
