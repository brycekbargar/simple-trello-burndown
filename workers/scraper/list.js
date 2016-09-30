const trello = require('superagent');
const trelloApi = require('superagent-prefix')('https://api.trello.com/1');
const config = require('./../../config/config.js');
const auth = {
  key: config.trello.key,
  token: config.trello.token
};

function List (data) {
  if(data.pos) { this.order = data.pos; }
  if(data.name) { this.name = data.name; }
}

List.getFromTrello = listId =>
  new Promise((resolve, reject) => {
    trello
    .get(`/lists/${listId}`)
    .query(Object.assign({}, auth, {
      fields: 'name,pos'
    }))
    .use(trelloApi)
    .accept('application/json')
    .end((err, res) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(new List(res.body));
    });
  });

List.upload = (client, list, listId) => 
  client.apis.default.put_Lists_listId({
    listId: listId,
    list: list
  });

module.exports = List;
