const trello = require('superagent');
const trelloApi = require('superagent-prefix')('https://api.trello.com/1');
const config = require('./../../../config/config.js');
const auth = {
  key: config.trello.key,
  token: config.trello.token
};

function CardHistory (data) {
  if(data.shortLink) { this.cardLink = data.shortLink; }
  if(data.cardLink) { this.cardLink = data.cardLink; }

  if(data.idList) { this.listId = data.idList; }
  if(data.listId) { this.listId = data.listId; }
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

module.exports = CardHistory;
