var config    = require('./config.js');
var db_svc    = config.dbServiceName,
    db_export = {};

// Attempt to autoconfigure for PG and MongoDB
if( db_svc == "postgresql"){
  db_export = require('./pgdb.js');
}else if(db_svc.indexOf("mongodb") != -1){
  // Depending on OCP version, db_svc may be 'mongodb-nationalparks' not 'mongodb'
  db_export = require('./mongodb.js');
}else{
  console.log("ERROR: DB Configuration missing! Failed to autoconfigure database");
}

db_export.wsinfo = function (req, res)
{
  res.status(200).json(config.wsinfo);
};

module.exports = exports = db_export;
