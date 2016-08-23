'use strict';
const knex = require('knex');
const config = require('./../../config/config.js');
const knexfile = require('./../../knexfile.js');

let connection;
module.exports = () => {
  return connection = connection || knex(knexfile[config.environment]);
};

