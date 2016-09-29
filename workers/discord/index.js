'use strict';

const moment = require('moment');

const CardHistory = require('./../model/cardHistory.js');
const Message = require('./../model/message.js');

module.exports = client =>
  CardHistory.getRecentHistory(client)
  .then(cardHistories => {
    const groupedByDate = cardHistories.reduce((prev, curr) => {
      const prevKeys = Object.keys(prev);
      const sameDay = prevKeys.findIndex(d => moment(d).isSame(curr.createdAt, 'day'));
      if(sameDay === -1) {
        prev[curr.createdAt] = [ curr ];
      }
      else if(moment(prevKeys[sameDay]).isBefore(curr.createdAt)) {
        delete prev[prevKeys[sameDay]];
        prev[curr.createdAt] = [ curr ];
      }
      else if(moment(prevKeys[sameDay]).isSame(curr.createdAt)) {
        prev[curr.createdAt].push(curr);
      }
      return prev;
    }, {});

    const lastTwoDays = Object.keys(groupedByDate).sort().slice(-2);

    const message = {};
    if(lastTwoDays.length === 2) {
      message.today = lastTwoDays[1];
    } else if(lastTwoDays.length === 1 && moment().add(-1, 'days').isBefore(lastTwoDays[0])) {
      message.today = lastTwoDays[0];
    }

    if(message.today) {
      message.todayBacklogCount = groupedByDate[message.today]
        .filter(ch => ch.status === 'backlog')
        .length;
      message.todayInProgressCount = groupedByDate[message.today]
        .filter(ch => ch.status === 'dev' || ch.status === 'qa')
        .length;

      if(lastTwoDays.length === 2) {
        message.yesterday = lastTwoDays[0];
        message.yesterdayBacklogCount = groupedByDate[message.yesterday]
          .filter(ch => ch.status === 'backlog')
          .length;
      }
    }

    return new Message(message);
  })
  .then(Message.sendDailyStatusUpdate);

