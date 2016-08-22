const knexFactory = require('knex');

module.exports = (debug) => {
  let knex = knexFactory({
    client: 'sqlite3',
    connection: ':memory:',
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true,
    debug: !!debug
  });

  return knex
    .migrate.latest()
    .then(() => knex);
};
