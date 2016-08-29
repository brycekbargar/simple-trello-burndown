'use strict';
const knexFactory = require('./knexFactory.js');

function List(data) {
  if(data.id) this.id = data.id;
  if(data.name) this.name = data.name;
  if(data.order) this.order = data.order;
  if(data.status) this.status = data.status;
}

List.createOrReplace = () => 
  knexFactory().then(knex => knex != null);

module.exports = List;
