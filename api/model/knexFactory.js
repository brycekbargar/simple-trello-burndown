'use strict';
const knex = require('knex');
const config = require('./../../config/config.js');
const knexfile = require('./../../config/knexfile.js');

let connection;
module.exports = () => {
  return Promise.resolve(connection = connection || knex(knexfile[config.environment]));
};

