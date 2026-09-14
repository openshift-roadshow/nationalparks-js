var path        = require('path'),
    MongoClient = require('mongodb').MongoClient,
    config      = require('./config.js');

console.log("DB connection: " + config.dbUrl);

var client    = new MongoClient(config.dbUrl);
var connected = null;

// The driver connects lazily, so simply requiring this module does not open a socket
// and the bootstrap scripts are still able to exit on their own.
function collection(){
  if(!connected){
    connected = client.connect().then(function (c){
      return c.db(config.dbName).collection(config.collectionName);
    });
  }
  return connected;
}

function fail(res, err){
  console.error('error running query', err);
  res.status(500).json({http_status: 500, error_msg: String(err)});
}

function translate(rows){
  return rows.map(function (row){
    return {
      id: row.name,
      latitude: row.coordinates[0],
      longitude: row.coordinates[1],
      name: row.toponymName
    };
  });
}

// Replaces the dataset rather than appending to it, so loading twice does not
// duplicate the parks. This matches the Java, Python and .NET backends.
function load_data(){
  var points = require(path.resolve('./nationalparks.json'));

  return collection().then(function (parks){
    return parks.createIndex({'coordinates': '2d'}).then(function (){
      console.log("index added on 'coordinates'");
      return parks.deleteMany({});
    }).then(function (){
      console.log("Importing map points...");
      return parks.insertMany(points);
    }).then(function (result){
      return result.insertedCount;
    });
  });
}

function flush_data(){
  return collection().then(function (parks){
    console.log("Dropping the DB...");
    return parks.drop().catch(function (err){
      // Dropping a collection that was never created is not a failure here.
      if(err && err.codeName === 'NamespaceNotFound'){
        return null;
      }
      throw err;
    });
  });
}

function close(){
  return client.close();
}

function init_db(req, res){
  load_data().then(function (inserted){
    var msg = "Items inserted in database: " + inserted;
    console.log(msg);
    res.type('text/plain').send(msg);
  }).catch(function (err){
    fail(res, err);
  });
}

function flush_db(req, res){
  flush_data().then(function (){
    res.type('text/plain').send("Dropped the DB.");
  }).catch(function (err){
    fail(res, err);
  });
}

function select_all(req, res){
  collection().then(function (parks){
    return parks.find({}).toArray();
  }).then(function (rows){
    res.json(translate(rows));
  }).catch(function (err){
    fail(res, err);
  });
}

function select_box(req, res){
  var query = req.query;
  var lat1  = Number(query.lat1),
      lon1  = Number(query.lon1),
      lat2  = Number(query.lat2),
      lon2  = Number(query.lon2);
  var limit = Number((typeof(query.limit) !== "undefined") ? query.limit : 40);

  if(!(lat1 && lon1 && lat2 && lon2 && limit)){
    return res.status(400).json({
      http_status: 400,
      error_msg: "this endpoint requires two pair of lat, long coordinates: lat1 lon1 lat2 lon2\na query 'limit' parameter can be optionally specified as well."
    });
  }

  // 'coordinates' is stored as [latitude, longitude], so the bounding box has to be
  // expressed in the same order. Querying it as [longitude, latitude] - as this code
  // used to - matches nothing and makes the endpoint always return an empty list.
  // $box also wants the bottom-left corner first, so normalise the two pairs the way
  // the Java backend does and accept the corners in either order.
  var box = [[Math.min(lat1, lat2), Math.min(lon1, lon2)],
             [Math.max(lat1, lat2), Math.max(lon1, lon2)]];

  collection().then(function (parks){
    return parks.find({"coordinates": {'$geoWithin': {'$box': box}}})
                .limit(limit)
                .toArray();
  }).then(function (rows){
    res.json(translate(rows));
  }).catch(function (err){
    fail(res, err);
  });
}

module.exports = exports = {
  selectAll: select_all,
  selectBox: select_box,
  flushDB:   flush_db,
  initDB:    init_db,
  loadData:  load_data,
  flushData: flush_data,
  close:     close
};
