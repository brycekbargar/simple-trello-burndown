'use strict';
const knexFactory = require('./knexFactory.js');

function Card(data) {
  if(data.no) this.no = data.no;
  if(data.name) this.name = data.name;
}

Card.createOrReplace = card => {
  let isNew = true;
  return knexFactory().then(knex => knex.transaction(tx =>
    tx.count('no as count').from('cards').where('no', card.no)
    .then(rows => rows[0].count)
    .then(count => {
      if(count === 0){
        return tx.insert(card).into('cards');
      }
      else {
        isNew = false;
        return tx('cards')
          .where('no', card.no).del()
          .then(() => tx.insert(card).into('cards'));
      }
    })))
  .then(() => isNew);
};

module.exports = Card;
