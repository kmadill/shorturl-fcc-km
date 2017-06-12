var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var http = require("http");
var autoincrement = require("mongoose-auto-increment");
//mongoose.Promise = global.Promise;

var app = express();

require('dotenv').config({ path: 'variables.env' });
var connection = mongoose.createConnection(process.env.MONGODB_URI || process.env.DATABASE);
autoincrement.initialize(connection);

const linkSchema = new mongoose.Schema({
  original_url: {
    type: String,
    trim: true
  }
});

linkSchema.plugin(autoincrement.plugin, 'Link');
var Link = connection.model('Link', linkSchema);

// Base route - displays info on the info and how to use it
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

// Forwards the user to the url that maps to the shortended url
app.get("/:linkid", function(req, res) {
  console.log(req.params.linkid);

  Link.findById(req.params.linkid, function (err, found) {
    if(err) {
      console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        error: err
      }));
      return;
    }
    res.redirect(found.original_url);
  });
});


// Creates a new entry in the DB
app.get('/new/:newentry*', function(req, res) {

  console.log(req.params);
  const link = new Link({ original_url: req.params.newentry });

  link.save(function (err, link) {
    if(err) {
      console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        original_url: req.params.newentry,
        short_url: 'Error. No entry created.'
      }));
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      original_url: req.params.newentry,
      short_url: `http://${req.headers['host']}/${link.id}`
    }));
  });

});

var port = process.env.PORT || 1337;
http.createServer(app).listen(port);
