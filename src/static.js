const restify = require('restify');

module.exports = (server) =>
  server.get(/\/?.*/, restify.serveStatic({
    directory: './src/static',
    default: 'index.html'
  }));

