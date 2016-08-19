const restify = require('restify');
const server = restify.createServer();

require('./api.js')(server);
require('./static.js')(server);

module.exports = server;
