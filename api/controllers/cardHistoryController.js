'use strict';

const CardHistory = require('./../model/cardHistory.js');

function post(req, res) {
  let updates = req.swagger.params.updates.value;
  new CardHistory(updates[0]);
  res.send(204);
}

function get(req, res) {
  res.send([]);
}

function orphans(req, res) {
  res.send([]);
}

module.exports = {
  post: post,
  get: get,
  orphans: orphans
};

