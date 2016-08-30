'use strict';

const CardHistory = require('./../model/model.js').CardHistory;

function post(req, res, next) {
  let updates = req.swagger.params.updates.value;
  return CardHistory
    .bulkCreate(updates.map(u => new CardHistory(u)))
    .then(() => res.send(204))
    .catch(next);
}

function get(req, res) {
  res.send(200, CardHistory.list());
}

function orphans(req, res) {
  res.send([]);
}

module.exports = {
  post: post,
  get: get,
  orphans: orphans
};

