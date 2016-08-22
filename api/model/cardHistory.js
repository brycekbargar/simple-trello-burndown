'use strict';
const knexFactory = require('./knexFactory.js');

function CardHistory(data) {
  this.cardNo = data.cardNo;
  this.listId = data.listId;
}

CardHistory.bulkCreate = cardHistories =>
  knexFactory().transaction(tx => 
    Promise.all(
      cardHistories
        .map(ch => tx
          .insert({
            card_no: ch.cardNo,
            list_id: ch.listId
          })
          .into('card_histories'))));

CardHistory.list = function() {
  return [];
};

module.exports = CardHistory;
