'use strict';

const Card = require('./../model/model.js').Card;

const newCard = req => {
  let card = Object.assign({}, { 
    no: req.swagger.params.cardNo.value
  }, req.swagger.params.card.value);
  return new Card(card);
};

function put(req, res, next) {
  return Card.createOrReplace(newCard(req))
    .then(isNew => res.send(isNew ? 201 : 204))
    .catch(next);
}

module.exports = {
  put: put
};

