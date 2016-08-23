'use strict';

module.exports = debug => 
  context => {
    const knex = require('knex')({
      client: 'sqlite3',
      connection: ':memory:',
      migrations: {
        directory: './migrations',
        tableName: 'knex_migrations'
      },
      useNullAsDefault: true,
      debug: !!debug
    });

    context.knex = knex;
    context.proxyquireStubs['./knexFactory.js'] = () => knex;

    return knex.migrate.latest();
  };
