const restify = require('restify');
const hello = require('./api/hello.js');

module.exports = (server) => {
  server.get('/hello/:name', hello);
  server.head('/hello/:name', hello);
};

