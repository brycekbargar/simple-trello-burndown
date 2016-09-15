const card_histories = 'card_histories';
const card_link = 'card_link';
const list_id = 'list_id';
const created_at = 'created_at';

module.exports = {
  up: knex =>
    knex.schema.createTable(card_histories, table => {
      table.string(card_link, 8).notNullable();
      table.uuid(list_id).notNullable();
      table.timestamp(created_at).defaultTo(knex.fn.now());
      table.unique([card_link, list_id, created_at]);
    }),
  down: knex => knex.schema.dropTable(card_histories)
};
