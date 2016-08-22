'use strict';

const SwaggerRestify = require('swagger-restify-mw');
const app = require('restify').createServer();
const config = require('./config.js');

SwaggerRestify.create({
  appRoot: __dirname
}, function(err, swaggerRestify) {
  if (err) { throw err; }

  swaggerRestify.register(app);

  app.listen(config.port);
});
