module.exports = {
  up: knex =>
    knex.schema.createTable('card_histories', table => {
      table.integer('card_no').notNullable();
      table.integer('list_id').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    }),
  down: knex => knex.schema.dropTable('card_histories')
};
