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
  return knexFactory().then(knex => knex
    .insert(list).into('lists')
    .debug()
    .tap(console.log))
  .then(() => isNew);
};

module.exports = List;
