'use strict';

const CardHistory = require('./cardHistory.js');
const List = require('./list.js');
const Card = require('./card.js');

module.exports = client => 
  CardHistory.scrapeTrello()
  .then(cardHistories => CardHistory.upload(client, cardHistories))
  .then(() => CardHistory.listOrphans(client))
  .then(orphans => Promise.all([
    Promise.all(
      orphans.filter(o => o.listId != null)
      .map(list => 
        List.getFromTrello(list.listId)
        .then(l => List.upload(client, l, list.listId)))),
    Promise.all(
      orphans.filter(o => o.cardLink != null)
      .map(card => 
        Card.getFromTrello(card.cardLink)
        .then(c => Card.upload(client, c, card.cardLink))))
  ]));

