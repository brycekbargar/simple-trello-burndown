'use strict';
const restify = require('restify');
const config = require('./config/config.js');

const web = () => {
  const app = restify.createServer();
  app.get(/\/*\.(json|yaml)/, restify.serveStatic({
    directory: './api/swagger/'
  }));

  const passport = require('passport-restify');
  const LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy;
  passport.use(new LocalAPIKeyStrategy((key, done) => 
      done(null, key === config.ScraperKey)));
  app.use(passport.initialize());

  const Swagger = require('swagger-node-runner');

  return new Promise((resolve, reject) => 
    Swagger.create({
      appRoot: __dirname
    }, (err, swagger) => {
      if (err) { 
        return reject(err); 
      }

      // All routes not defined with Swagger are 404
      // We're doing this here because it need to run before any Auth happens 
      app.use((req, res, next) => 
        next(
          !!swagger.getOperation(req) &&
          !!swagger.getPath(req)
            ? undefined
            : new restify.NotFoundError()));

      // The following sort of uses swagger-restify-mw
      // https://github.com/apigee-127/swagger-restify
      const swaggerMiddleware = swagger.connectMiddleware().middleware();

      // Restify adds a query prop that it doesn't use to the request and swagger can't handle it
      app.use((req, res, next) => {
        req.query = undefined;
        return next();
      });
      // Restify only support one route definition so
      // we need to define our open routes and then call the middleware
      app.get({path: '/api/hello', flags: 'i'}, swaggerMiddleware);

      // Everything else gets Auth and then we call into the middleware
      // Since we're handling '*' we need to implement our own 404
      ['del', 'get', 'head', 'opts', 'post', 'put', 'patch'].forEach(m => 
        app[m]('.*', 
          passport.authenticate('localapikey', {session: false}),
          swaggerMiddleware));

      return resolve({
        app: app,
        start: () => app.listen(config.port)
      });
    }));
};

const scraper = (spec) => {
  const SwaggerClient = require('swagger-client');
  const swaggerOpts = {
    usePromise: true
  };
  if(spec){
    swaggerOpts.spec = spec;
    swaggerOpts.url = 'http://';
  } else{
    swaggerOpts.url = config.swaggerClientUrl;
  }

  return new SwaggerClient(swaggerOpts)
    .then(client => ({
      client: client,
      start: () => require('./workers/scraper/index.js')(client)
    }));
};

module.exports = {
  web:  web,
  scraper: scraper
};
