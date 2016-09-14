const card_histories = 'card_histories';
const card_no = 'card_no';
const list_id = 'list_id';
const created_at = 'created_at';

module.exports = {
  up: knex =>
    knex.schema.createTable(card_histories, table => {
      table.integer(card_no).notNullable();
      table.uuid(list_id).notNullable();
      table.timestamp(created_at).defaultTo(knex.fn.now());
      table.unique([card_no, list_id, created_at]);
    }),
  down: knex => knex.schema.dropTable(card_histories)
};
