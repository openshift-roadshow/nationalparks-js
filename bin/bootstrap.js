var config = require('./config.js')
var db = require('./db.js')

// Flush the DB
//db.flushDB();

// Initialize the DB
if(config.get("db_autoload") == "true"){
  console.log("pre-populating database values...")
  db.initDB();
  //db.initDB('keepAlive');
}
