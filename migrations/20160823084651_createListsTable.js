const lists = 'lists';
const id = 'id';
const name = 'name';
const order = 'order';
const status = 'status';

module.exports  = {
  up: knex => 
    knex.schema.createTable(lists, table => {
      table.uuid(id).primary();
      table.string(name, 16384).notNullable();
      table.integer(order).notNullable();
      table.enum(status, [
        'backlog',
        'dev',
        'qa',
        'done'
      ]).nullable();
    }),
  down: knex => knex.schema.dropTable(lists)
};
