var multipaas   = require('config-multipaas');
var host_from_uri, port_from_uri;
var autoconfig  = function (config_overrides){
  // If uri is set, use it to parse out the host and port
  // otherwise use DB_HOST and DB_PORT
  // uri comes in the form (mongodb://127.0.0.1:27017)
  
  if (process.env.uri) {
    var pattern = /mongodb?:\/\/([^:^/]*):?(\d*)?/;
    var match = process.env.uri.match(pattern);
    
    if (match !== null && match.length > 0){
      host_from_uri = match[1];
      port_from_uri = match[2];	
    }
  }

  var config    = multipaas(config_overrides).add({
    uri: process.env.uri || process.env.DB_USERNAME || 'mongodb',
    username: process.env.MONGODB_USER || process.env.DB_USERNAME || 'mongodb',
    password: process.env.MONGODB_PASSWORD || process.env.DB_PASSWORD || 'mongodb',
    table_name: process.env.MONGODB_DATABASE || process.env.DB_NAME || 'mongodb',
    collection_name: process.env.MONGODB_DATABASE || process.env.DB_NAME || 'mongodb',
    db_autoload: process.env.DB_AUTOLOAD || "false",
    db_host: host_from_uri || process.env.DB_HOST || "mongodb",
    db_port: port_from_uri || process.env.DB_PORT || "27017",
    db_svc_name: process.env.DATABASE_SERVICE_NAME || process.env.DB_HOST || "mongodb"
  })

  var ws_info = {
    id: "nationalparks-js",
    displayName: "National Parks (JS)",
    type: "cluster",
    center: {'latitude': '47.039304', 'longitude': '14.505178'},
    zoom: 4
  };

  var db_config = config.get('db_svc_name')+'://'+config.get('username')+":"+config.get('password')+"@"+config.get('db_host')+":"+config.get('db_port')+"/";
      table     = config.get('table_name');

  config.add({db_config: db_config+table});
  config.add({wsinfo: JSON.stringify(ws_info)});
  return config;
}

exports = module.exports = autoconfig();
