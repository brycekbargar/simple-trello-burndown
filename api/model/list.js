'use strict';
const knexFactory = require('./knexFactory.js');

function List(data) {
  if(data.id) this.id = data.id;
  if(data.name) this.name = data.name;
  if(data.order) this.order = data.order;
  if(data.status) this.status = data.status;
}

List.createOrReplace = list => {
  let isNew = true;
  return knexFactory().then(knex => knex.transaction(tx =>
    tx.count('id as count').from('lists').where('id', list.id)
    .then(rows => rows[0].count)
    .then(count => {
      if(count === 0){
        return tx.insert(list).into('lists');
      }
      else {
        isNew = false;
        return tx('lists')
          .where('id', list.id).del()
          .then(() => tx.insert(list).into('lists'));
      }
    })))
  .then(() => isNew);
};

List.update = list => knexFactory().then(knex => knex('lists')
  .where('id', list.id)
  .update(list)
  .then(count => count === 1));

List.list = () => 
  knexFactory().then(knex => knex
    .select()
    .from('lists'))
    .then(rows => rows.map(r => new List(r)));

module.exports = List;
