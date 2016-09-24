'use strict';
const knex = require('knex');
const config = require('./../../config/config.js');
const knexfile = require('./../../config/knexfile.js');

let connection;
module.exports = () => {
  const knexConfig = knexfile[config.environment];
  knexConfig.pool = knexConfig.pool || {};
  // When using ClearDB the connection.end() method for mysql throws an error
  // When the pool idle timeout is hit knex tries to destroy the connection
  // Removing from the pool calls connection.removeAllListeners() immediately before calling connection.end()
  // We want to intercept that call and hook back up an error handler so the app doesn't die
  knexConfig.pool.afterCreate = knexConfig.pool.afterCreate || 
    function(conn, cb) {
      const removeAllListeners = conn.removeAllListeners;
      conn.removeAllListeners = () => {
        removeAllListeners.call(conn);
        conn.on('error', err => conn.__knex__disposed = err);
      };
      cb(null);
    };
  return Promise.resolve(connection = connection || knex(knexConfig));
};

