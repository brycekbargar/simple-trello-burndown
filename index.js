'use strict';
const config = require('./config/config.js');

const web = () => {
  const SwaggerRestify = require('swagger-restify-mw');
  const restify = require('restify');
  const app = restify.createServer();

  return new Promise((resolve, reject) => 
    SwaggerRestify.create({
      appRoot: __dirname
    }, (err, swaggerRestify) => {
      if (err) { 
        reject(err); 
        return;
      }
  
      app.get(/\/*\.(json|yaml)/, restify.serveStatic({
        directory: './api/swagger/'
      }));

      swaggerRestify.register(app);

      resolve({
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

  return new Promise((resolve, reject) => 
    new SwaggerClient(swaggerOpts)
    .then(client => 
      resolve({
        client: client,
        start: () => console.log('starting')
      }))
    .catch(reject));
};

module.exports = {
  web:  web,
  scraper: scraper
};
