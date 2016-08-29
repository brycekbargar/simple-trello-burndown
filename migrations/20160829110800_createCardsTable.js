const cards = 'cards';
const no = 'no';
const name = 'name';

module.exports  = {
  up: knex => 
    knex.schema.createTable(cards, table => {
      table.integer(no).primary();
      table.string(name, 16384).notNullable();
    }),
  down: knex => knex.schema.dropTable(cards)
};
