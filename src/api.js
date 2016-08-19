const restify = require('restify');
const helloController = require('./api/helloController.js');

module.exports = (server) => {
  server.get({
    path: '/api/hello/:name',
    docString: 
`Multiple Lines
of documentation`
  }, helloController.get);
  server.head('/api/hello/:name', helloController.get);
};

