var express = require("express");
var mongoose = require("bluebird").promisifyAll(require("mongoose"));
var path = require("path");
var http = require("http");
var autoincrement = require("mongoose-auto-increment");
var validUrl = require("valid-url");

mongoose.Promise = global.Promise;

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
  Link.findById(req.params.linkid)
    .then(function(found) {
      res.redirect(found.original_url);
    })
    .catch(function(e) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        error: 'Cannot find URL in database. Please try again.'
      }));
    });
});

// Creates a new entry in the DB
app.get('/new/:newentry(*)', function(req, res) {

  //Using req.params.newentry as well as other methods not valid, so parsing URL instead
  const urlToSave = req.originalUrl.replace('/new/', '');

  //First, check if URL is valid
  if(!validUrl.isUri(urlToSave)) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: 'Not a valid URL. Please try again.'
    }));
    return;
  }

  const link = new Link({ original_url: urlToSave }).save()
    .then(function (link) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        original_url: urlToSave,
        short_url: `http://${req.headers['host']}/${link.id}`
      }));
      return;
    })
    .catch(function(e) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        original_url: urlToSave,
        short_url: 'Error. No entry created.'
      }));
    });
});

var port = process.env.PORT || 1337;
http.createServer(app).listen(port);
