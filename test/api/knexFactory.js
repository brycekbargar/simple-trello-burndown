'use strict';

module.exports = debug => 
  context => {
    context.knex = require('knex')({
      client: 'sqlite3',
      connection: ':memory:',
      migrations: {
        directory: './migrations',
        tableName: 'knex_migrations'
      },
      useNullAsDefault: true,
      debug: !!debug
    });

    context.proxyquireStubs['./knexFactory.js'] = () => Promise.resolve(context.knex);

    return context.knex.migrate.latest();
  };
