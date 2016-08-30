'use strict';

const CardHistory = require('./../model/model.js').CardHistory;

function post(req, res, next) {
  let updates = req.swagger.params.updates.value;
  return CardHistory
    .bulkCreate(updates.map(u => new CardHistory(u)))
    .then(() => res.send(204))
    .catch(next);
}

function get(_, res, next) {
  return CardHistory.list()
    .then(list => res.send(200, list))
    .catch(next);
}

function orphans(_, res, next) {
  return CardHistory.listOrphans()
    .then(list => res.send(200, list))
    .catch(next);
}

module.exports = {
  post: post,
  get: get,
  orphans: orphans
};

