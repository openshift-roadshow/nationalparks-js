var db = require('./db.js')

// Flush the DB
db.flushData().catch(function (err){
  console.error(err);
  process.exitCode = 1;
}).then(db.close);
