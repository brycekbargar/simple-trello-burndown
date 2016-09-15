const CardHistory = require('./model/cardHistory.js');
const List = require('./model/list.js');

module.exports = client => 
  CardHistory.scrapeTrello()
  .then(cardHistories => CardHistory.upload(client, cardHistories))
  .then(() => CardHistory.listOrphans(client))
  .then(orphans => orphans.filter(o => o.listId != null))
  .then(lists => Promise.all(
    lists.map(list =>
      List.getFromTrello(list.listId)
      .then(l => List.upload(client, l, list.listId)))));

