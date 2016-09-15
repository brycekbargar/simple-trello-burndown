const trello = require('superagent');
const trelloApi = require('superagent-prefix')('https://api.trello.com/1');
const config = require('./../../../config/config.js');
const auth = {
  key: config.trello.key,
  token: config.trello.token
};

function Card (data) {
  if(data.name) { this.name = data.name; }
}

Card.getFromTrello = cardNo =>
  new Promise((resolve, reject) => {
    trello
    .get(`/Cards/${cardNo}`)
    .query(Object.assign({}, auth, {
      fields: 'name'
    }))
    .use(trelloApi)
    .accept('application/json')
    .end((err, res) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(new Card(res.body));
    });
  });

Card.upload = (client, card, cardNo) => 
  client.apis.default.put_Cards_cardNo({
    cardNo: cardNo,
    card: card
  });

module.exports = Card;
