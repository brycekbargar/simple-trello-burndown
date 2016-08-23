'use strict';
const knexFactory = require('./knexFactory.js');

function CardHistory(data) {
  if(data.cardNo) this.card_no = data.cardNo;
  if(data.listId) this.list_id = data.listId;
  if(data.created_at) this.createdAt = data.created_at;
  if(data.status) this.status = data.status;
}

CardHistory.bulkCreate = cardHistories =>
  knexFactory().transaction(tx => 
    Promise.all(cardHistories.map(ch =>
      tx.insert(ch).into('card_histories'))));

CardHistory.list = () =>
  knexFactory().select([
    'CH.created_at',
    'L.status'
  ])
  .from('card_histories as CH')
  .innerJoin('lists as L', 'CH.list_id', 'L.id')
  .whereNotNull('L.status')
  .then(rows => rows.map(r => new CardHistory(r)));

module.exports = CardHistory;
