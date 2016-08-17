const restify = require('restify');
const hello = require('./api/hello.js');

module.exports = (server) => {
  server.get('/api/hello/:name', hello);
  server.head('/api/hello/:name', hello);
};

