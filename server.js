var express = require("express");
var path = require("path");
var http = require("http");

var app = express();

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

var port = process.env.PORT || 1337;
http.createServer(app).listen(port);
