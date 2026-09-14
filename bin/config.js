// MONGODB_SERVER_HOST, MONGODB_DATABASE, MONGODB_USER and MONGODB_PASSWORD are the
// variables the OpenShift workshop documents, and are shared with the Java, Python and
// .NET National Parks backends. The older DB_* names are still honoured so existing
// deployments keep working.
var env = process.env;

var host = env.MONGODB_SERVER_HOST || env.DB_HOST || 'mongodb-nationalparks';
var port = env.MONGODB_SERVER_PORT || env.DB_PORT || '27017';
var proto = env.DB_PROTO || 'mongodb';
var database = env.MONGODB_DATABASE || env.DB_NAME || 'mongodb';
var username = env.MONGODB_USER || env.DB_USERNAME || 'mongodb';
var password = env.MONGODB_PASSWORD || env.DB_PASSWORD || 'mongodb';

var credentials = username
  ? encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@'
  : '';

module.exports = {
  ip: env.OPENSHIFT_NODEJS_IP || env.IP || '0.0.0.0',
  port: Number(env.OPENSHIFT_NODEJS_PORT || env.PORT || 8080),

  dbServiceName: env.DATABASE_SERVICE_NAME || 'mongodb',
  dbUrl: proto + '://' + credentials + host + ':' + port + '/' + database,
  dbName: database,
  collectionName: env.MONGODB_COLLECTION || database,
  dbAutoload: (env.DB_AUTOLOAD || 'false') === 'true',

  wsinfo: {
    id: 'nationalparks-js',
    displayName: 'National Parks (JS)',
    type: 'cluster',
    center: { latitude: '47.039304', longitude: '14.505178' },
    zoom: 4
  }
};
