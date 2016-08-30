'use strict';

const List = require('./../model/model.js').List;

const newList = req => {
  let list = Object.assign({}, { 
    id: req.swagger.params.listId.value
  }, req.swagger.params.list.value);
  console.log(list);
  return new List(list);
};

function put(req, res, next) {
  return List.createOrReplace(newList(req))
    .then(isNew => res.send(isNew ? 201 : 204))
    .catch(next);
}

function get(_, res, next) {
  return List.list()
    .then(lists => res.send(200, lists))
    .catch(next);
}

function patch(req, res, next) {
  return List.update(newList(req))
    .then(() => res.send(204))
    .catch(next);
}

module.exports = {
  put: put,
  get: get,
  patch: patch
};

