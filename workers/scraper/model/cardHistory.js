const trello = require('superagent');
const trelloApi = require('superagent-prefix')('https://api.trello.com/1');
const config = require('./../config/config.js');
const auth = {
  key: config.trelloKey,
  token: config.trelloToken
};

function CardHistory () {
}

CardHistory.list = () =>
  new Promise((resolve, reject) => {
    trello
    .get(`/boards/${config.trelloBoard}/cards`)
    .query(Object.assign({}, auth, {
      fields: 'idShort,idLabels,idList'
    }))
    .use(trelloApi)
    .end((err, res) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });

module.exports = CardHistory;
