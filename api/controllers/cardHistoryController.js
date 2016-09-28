'use strict';

const CardHistory = require('./../model/model.js').CardHistory;

function post(req, res, next) {
  const updates = req.swagger.params.updates.value;
  return CardHistory
    .bulkCreate(updates.map(u => new CardHistory(u)))
    .then(() => res.send(204))
    .catch(next);
}

function get(req, res, next) {
  const params = req.swagger.params;
  const filter = {};
  if(params.start.value) {
    filter.start = params.start.value;
  }
  if(params.end.value) {
    filter.end = params.end.value;
  }
  return CardHistory.list(filter)
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

