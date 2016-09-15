const cards = 'cards';
const no = 'no';
const name = 'name';
const link = 'link';

module.exports  = {
  up: knex => 
    knex.schema.createTable(cards, table => {
      table.string(link, 8).primary();
      table.integer(no).notNullable();
      table.string(name, 16384).notNullable();
    }),
  down: knex => knex.schema.dropTable(cards)
};
