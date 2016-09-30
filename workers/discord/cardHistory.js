'use strict';

const moment = require('moment');

function CardHistory (data) {
  if(data.createdAt) { this.createdAt = data.createdAt; }
  if(data.status) { this.status = data.status; }
}

CardHistory.getRecentHistory = client => 
  client.apis.default.get_CardHistory({
    start: moment().add(-2, 'days').startOf('day').format()
  })
  .then(cardHistories => cardHistories.map(ch => new CardHistory(ch)));

module.exports = CardHistory;
