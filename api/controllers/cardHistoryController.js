'use strict';

const CardHistory = require('./../model/cardHistory.js');

function post(req, res) {
  let updates = req.swagger.params.updates.value;
  CardHistory.bulkCreate(updates.map(u => new CardHistory(u)));
  res.send(204);
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

