module.exports = {
  port: process.env.PORT,
  knex: {
    host: process.env.JAWSDB_MARIA_URL || process.env.DEV_MARIA_URL,
    database: process.env.DATABASE,
  }
};
