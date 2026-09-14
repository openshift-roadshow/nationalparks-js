var config = require('./config.js')
var db = require('./db.js')

// Initialize the DB
if(config.dbAutoload){
  console.log("pre-populating database values...")
  db.loadData().then(function (inserted){
    console.log("Items inserted in database: " + inserted);
  }).catch(function (err){
    console.error(err);
    process.exitCode = 1;
  }).then(db.close);
}
