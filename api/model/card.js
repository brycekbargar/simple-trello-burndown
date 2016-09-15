'use strict';
const knexFactory = require('./knexFactory.js');

function Card(data) {
  if(data.link) this.link = data.link;
  if(data.no) this.no = data.no;
  if(data.name) this.name = data.name;
}

Card.createOrReplace = card => {
  let isNew = true;
  return knexFactory().then(knex => knex.transaction(tx =>
    tx.count('link as count').from('cards').where('link', card.link)
    .then(rows => rows[0].count)
    .then(count => {
      if(count === 0){
        return tx.insert(card).into('cards');
      }
      else {
        isNew = false;
        return tx('cards')
          .where('link', card.link).del()
          .then(() => tx.insert(card).into('cards'));
      }
    })))
  .then(() => isNew);
};

module.exports = Card;
