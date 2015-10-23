'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
// var config = require('./lib/config/config');

// Connect to database
// var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
// var modelsPath = path.join(__dirname, 'lib/models');
// fs.readdirSync(modelsPath).forEach(function (file) {
//   if (/(.*)\.(js$|coffee$)/.test(file)) {
//     require(modelsPath + '/' + file);
//   }
// });

// Populate empty DB with sample data
// require('./lib/config/dummydata');

// Passport Configuration
// var passport = require('./lib/config/passport');

var app = express();

// Express settings
require('./express-config')(app);

// Routing
// require('./lib/routes')(app);

app.get('/', function (req, res) {
	res.render('index');
});

app.get("/api/tts", function (req, res){
  res.type('audio/mpeg');

  var text = req.query.text;
  var request = require('request');
  // var url = "http://translate.google.com/translate_tts?tl=en&q=" + text;
  var url = "http://www.voicerss.org/controls/speech.ashx?hl=en-us&c=mp3&src=" + text;
  request.get(url).pipe(res);
});

// Start server
app.listen(process.env.PORT || 9000, function () {
});

// Expose app
exports = module.exports = app;