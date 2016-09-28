'use strict';
const knexFactory = require('./knexFactory.js');

function CardHistory(data) {
  if(data.cardLink) this.card_link = data.cardLink;
  if(data.card_link) this.cardLink = data.card_link;

  if(data.listId) this.list_id = data.listId;
  if(data.list_id) this.listId = data.list_id;

  if(data.created_at) this.createdAt = data.created_at;
  if(data.status) this.status = data.status;
}

CardHistory.bulkCreate = cardHistories =>
  knexFactory().then(knex => knex.insert(cardHistories).into('card_histories'));

CardHistory.list = filter =>
  knexFactory().then(knex => {
    filter = filter || {};
    let query = knex
      .select([
        'CH.created_at',
        'L.status'
      ])
      .from('card_histories as CH')
      .innerJoin('lists as L', 'CH.list_id', 'L.id')
      .whereNotNull('L.status');

    if(filter.start && filter.end) {
      query = query.whereBetween('created_at', [filter.start, filter.end]);
    }
    if(filter.start && !filter.end) {
      query = query.where('created_at', '>', filter.start);
    }
    if(!filter.start && filter.end) {
      query = query.where('created_at', '<', filter.end);
    }

    return query;
  })
  .then(rows => rows.map(r => new CardHistory(r)));

CardHistory.listOrphans = () =>
  knexFactory().then(knex => knex
    .select([
      'CH.list_id as list_id',
      knex.raw('null as card_link')
    ])
    .from('card_histories as CH')
    .leftJoin('lists as L', 'CH.list_id', 'L.id')
    .whereNull('L.id')
    .union(function() {
      this.select([
        knex.raw('null as list_id'),
        'CH.card_link'
      ])
      .from('card_histories as CH')
      .leftJoin('cards as C', 'CH.card_link', 'C.link')
      .whereNull('C.link');
    }))
  .then(rows => rows.map(r => new CardHistory(r)));

module.exports = CardHistory;
