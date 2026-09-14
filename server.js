var express = require('express'),
    config  = require('./bin/config.js'),
    db      = require('./bin/db.js');
var server  = express();

// Routes
server.get('/ws/data/load', db.initDB);
server.get('/ws/data/within', db.selectBox);
server.get('/ws/data/all', db.selectAll);
server.get('/ws/backends/info', db.wsinfo);
server.get('/ws/backends/info/:who', db.wsinfo);
server.get('/ws/info', db.wsinfo);
server.get('/ws/info/:who', db.wsinfo);
server.get('/ws/healthz', function (req, res) { res.type('text/plain').send("OK"); });
server.get('/ws/healthz/:ok', function (req, res) { res.type('text/plain').send("OK"); });
server.get('/', function (req, res)
{
  res.type('text/plain').send("Welcome to the National Parks data service.");
});

server.listen(config.port, config.ip, function () {
  console.log( "Listening on " + config.ip + ", port " + config.port )
});
