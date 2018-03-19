var multipaas   = require('config-multipaas');
var autoconfig  = function (config_overrides){
  var config    = multipaas(config_overrides).add({
    uri: process.env.uri || process.env.DB_USERNAME || 'mongodb',
    username: process.env.username || process.env.DB_USERNAME || 'mongodb',
    password: process.env.password || process.env.DB_PASSWORD || 'mongodb',
    table_name: process.env.database_name || process.env.DB_NAME || 'mongodb',
    collection_name: process.env.database_name || process.env.DB_NAME || 'mongodb',
    db_host: process.env.DB_HOST || "mongodb",
    db_port: process.env.DB_PORT || "27017",
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
