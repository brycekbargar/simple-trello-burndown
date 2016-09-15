const cards = 'cards';
const no = 'no';
const name = 'name';
const link = 'link';

module.exports  = {
  up: knex => 
    knex.schema.createTable(cards, table => {
      table.integer(no).primary();
      table.string(name, 16384).notNullable();
      table.string(link, 8).notNullable();
    }),
  down: knex => knex.schema.dropTable(cards)
};
