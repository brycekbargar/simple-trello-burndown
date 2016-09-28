'use strict';

const trello = require('superagent');
const trelloApi = require('superagent-prefix')('https://api.trello.com/1');
const config = require('./../../config/config.js');
const auth = {
  key: config.trello.key,
  token: config.trello.token
};
const moment = require('moment');

function CardHistory (data) {
  if(data.shortLink) { this.cardLink = data.shortLink; }
  if(data.cardLink) { this.cardLink = data.cardLink; }

  if(data.idList) { this.listId = data.idList; }
  if(data.listId) { this.listId = data.listId; }

  if(data.createdAt) { this.createdAt = data.createdAt; }
  if(data.status) { this.status = data.status; }
}

CardHistory.scrapeTrello = () =>
  new Promise((resolve, reject) => {
    trello
    .get(`/boards/${config.trello.board}/cards`)
    .query(Object.assign({}, auth, {
      fields: 'idLabels,idList,shortLink'
    }))
    .use(trelloApi)
    .accept('application/json')
    .end((err, res) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(res.body
        .filter(ch => ch.idLabels.some(l => l === config.trello.label))
        .map(ch => new CardHistory(ch)));
    });
  });

CardHistory.upload = (client, cardHistories) => 
  client.apis.default.post_CardHistory({
    updates: cardHistories
  });

CardHistory.listOrphans = client => 
  client.apis.default.orphans({})
  .then(res => res.obj)
  .then(orphans => orphans.map(o => new CardHistory(o)));

CardHistory.getRecentHistory = client => 
  client.apis.default.get_CardHistory({
    start: moment().add(-2, 'days').startOf('day').format()
  })
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

    return Object.keys(groupedByDate)
      .sort().slice(-2)
      .reduce((prev, curr) => prev.concat(groupedByDate[curr]), []);
  });

module.exports = CardHistory;
