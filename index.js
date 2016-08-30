'use strict';

const SwaggerRestify = require('swagger-restify-mw');
const app = require('restify').createServer();
const config = require('./config/config.js');

const web = () =>
  new Promise((resolve, reject) => 
    SwaggerRestify.create({
      appRoot: __dirname
    }, (err, swaggerRestify) => {
      if (err) { 
        reject(err); 
        return;
      }
  
      swaggerRestify.register(app);

      resolve({
        app: app,
        start: () => app.listen(config.port)
      });
    }));

module.exports = {
  web:  web,
  scraper: () => console.log('running task')
};
