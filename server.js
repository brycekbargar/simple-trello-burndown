const restify = require('restify');
const api = require('./src/api.js');
const static = require('./src/static.js');

const server = restify.createServer();

api(server);
static(server);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
