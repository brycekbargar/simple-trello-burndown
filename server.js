const restify = require('restify');
const api = require('./src/api.js');
const static = require('./src/static.js');

const server = restify.createServer();

// The static assets are routed from the root url
// We need to register the more specific api routes first
api(server);
static(server);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
