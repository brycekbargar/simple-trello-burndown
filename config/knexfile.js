module.exports = {

  development: {
    client: 'mariasql',
    connection: {
      host: '127.0.0.1',
      db: 'simple_trello_burndown',
      user: 'root'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './../migrations',
      tableName: 'knex_migrations'
    },
    debug: true
  },

  production: {
    client: 'mysql',
    connection: process.env.CLEARDB_DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './../migrations',
      tableName: 'knex_migrations'
    }
  }

};
