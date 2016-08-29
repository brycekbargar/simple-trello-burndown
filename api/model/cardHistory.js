'use strict';
const knexFactory = require('./knexFactory.js');

function CardHistory(data) {
  if(data.cardNo) this.card_no = data.cardNo;
  if(data.card_no) this.cardNo = data.card_no;

  if(data.listId) this.list_id = data.listId;
  if(data.list_id) this.listId = data.list_id;

  if(data.created_at) this.createdAt = data.created_at;
  if(data.status) this.status = data.status;
}

CardHistory.bulkCreate = cardHistories =>
  knexFactory().insert(cardHistories).into('card_histories');

CardHistory.list = () =>
  knexFactory().select([
    'CH.created_at',
    'L.status'
  ])
  .from('card_histories as CH')
  .innerJoin('lists as L', 'CH.list_id', 'L.id')
  .whereNotNull('L.status')
  .then(rows => rows.map(r => new CardHistory(r)));

CardHistory.listOrphans = () =>
  knexFactory().select([
    'CH.list_id as list_id',
    knexFactory().raw('null as card_no')
  ])
  .from('card_histories as CH')
  .leftJoin('lists as L', 'CH.list_id', 'L.id')
  .whereNull('L.id')
  .union(function() {
    this.select([
      knexFactory().raw('null as list_id'),
      'CH.card_no'
    ])
    .from('card_histories as CH')
    .leftJoin('cards as C', 'CH.card_no', 'C.no')
    .whereNull('C.no');
  })
  .then(rows => rows.map(r => new CardHistory(r)));

module.exports = CardHistory;
