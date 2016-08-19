const restify = require('restify');
const api = require('./src/api.js');
const static = require('./src/static.js');

const server = restify.createServer();

api(server);
static(server);

const port = process.env.PORT || 80;

server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});
