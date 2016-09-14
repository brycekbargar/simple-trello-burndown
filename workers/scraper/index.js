const CardHistory = require('./model/cardHistory.js');

module.exports = client => 
  CardHistory.scrapeTrello()
  .then(ch => CardHistory.upload(client, ch))
  .then(() => CardHistory.listOrphans(client));

