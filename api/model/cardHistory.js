'use strict';

function CardHistory(data) {
  this.data = data;
}

CardHistory.bulkCreate = function(cardHistories) {
  this.cardHistories = cardHistories;
};

module.exports = CardHistory;
