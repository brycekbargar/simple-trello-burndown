const restify = require('restify');
const helloController = require('./api/helloController.js');

module.exports = (server) => {
  server.get('/api/hello/:name', helloController.get);
  server.head('/api/hello/:name', helloController.get);
};

