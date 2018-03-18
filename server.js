var restify = require('restify'),
    fs      = require('fs'),
    config  = require('./bin/config.js'),
    db      = require('./bin/db.js');
var app     = restify.createServer();
var ws_info = {
  id: "nationalparks-js",
  displayName: "National Parks (JS)",
  type: "cluster",
  center: {'latitude': '47.039304', 'longitude': '14.505178'},
  zoom: 4
};
var wsinfo = function (req, res, next)
{
  res.status(200);
  res.header('Content-Type', 'application/json');
  res.end(JSON.stringify(ws_info));
};

//db.initDB('keepAlive');

app.use(restify.queryParser())
app.use(restify.CORS())
app.use(restify.fullResponse())

// Routes
app.get('/ws/data/load', db.initDB);
app.get('/ws/data/within', db.selectBox);
app.get('/ws/data/all', db.selectAll);
app.get('/ws/info/:who', wsinfo);
app.get('/ws/info', wsinfo);

app.get('/ws/healthz', function (req, res, next)
{
  res.send("OK");
});

app.get('/', function (req, res, next)
{
  res.send("Welcome to the National Parks data service.");
});

app.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT') )
});
