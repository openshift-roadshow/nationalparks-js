var config    = require('./config.js');
var db_svc    = config.get('db_svc_name'),
    db_export = {};

// Attempt to autoconfigure for PG and MongoDB
if( db_svc == "postgresql"){
  db_export = require('./pgdb.js');
}else if( db_svc == "mongodb"){
  db_export = require('./mongodb.js');
}else{
  console.log("ERROR: DB Configuration missing! Failed to autoconfigure database");
}

db_export.wsinfo = function (req, res, next)
{
  res.status(200);
  res.header('Content-Type', 'application/json');
  res.end(config.get('wsinfo'));
};

module.exports = exports = db_export;
