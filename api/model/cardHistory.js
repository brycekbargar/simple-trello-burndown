'use strict';

function CardHistory(data) {
  this.data = data;
}

CardHistory.bulkCreate = function(cardHistories) {
  this.cardHistories = cardHistories;
};

CardHistory.list = function() {
  return [];
};

module.exports = CardHistory;
