const trello = require('superagent');
const trelloApi = require('superagent-prefix')('https://api.trello.com/1');
const config = require('./../../../config/config.js');
const auth = {
  key: config.trello.key,
  token: config.trello.token
};

function Card (data) {
  if(data.name) { this.name = data.name; }
  if(data.idShort) { this.no = data.idShort; }
}

Card.getFromTrello = link =>
  new Promise((resolve, reject) => {
    trello
    .get(`/Cards/${link}`)
    .query(Object.assign({}, auth, {
      fields: 'name,idShort'
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

Card.upload = (client, card, link) => 
  client.apis.default.put_Cards_link({
    link: link,
    card: card
  });

module.exports = Card;
