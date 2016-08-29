#!/usr/bin/env node

'use strict';
const config = require('./knexfile.js')['development'];
const db = config.connection.db;
delete config.connection.db;
config.migrations.directory = './migrations';

// SQL INJECT ALL THE THINGS!
let knex = require('knex')(config);
knex.raw(`DROP DATABASE IF EXISTS ${db}`)
  .then(() => knex.raw(`CREATE DATABASE ${db}`))
  .then(() => {
    knex.destroy();

    config.connection.db = db;
    knex = require('knex')(config);
    console.log(process.cwd());
    console.log(config.migrations);

    knex.migrate
      .latest()
      .then(console.log)
      .catch(console.error)
      .finally(process.exit);
  });
