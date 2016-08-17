const restify = require('restify');

module.exports = (server) =>
    server.get(/^(?!\/api)\/?.*/, restify.serveStatic({
    directory: './src/static',
    default: 'index.html'
  }));

