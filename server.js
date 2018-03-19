var restify = require('restify'),
    fs      = require('fs'),
    config  = require('./bin/config.js'),
    db      = require('./bin/db.js');
var app     = restify.createServer({strictRouting: false});

//db.initDB('keepAlive');
app.use(restify.plugins.queryParser())

// Routes
app.get('/ws/data/load', db.initDB);
app.get('/ws/data/within', db.selectBox);
app.get('/ws/data/all', db.selectAll);
app.get('/ws/info', db.wsinfo);
app.get('/ws/healthz', function (req, res, next) { res.send("OK"); });
app.get('/', function (req, res, next)
{
  res.send("Welcome to the National Parks data service.");
});

app.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT') )
});
