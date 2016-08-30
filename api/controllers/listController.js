'use strict';

const restify = require('restify');
const List = require('./../model/model.js').List;

const newList = req => {
  let list = Object.assign({}, { 
    id: req.swagger.params.listId.value
  }, req.swagger.params.list.value);
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
    .then(updated => {
      if(updated) {
        res.send(204);
      } else {
        next(new restify.ResourceNotFoundError());
      }
    })
    .catch(next);
}

module.exports = {
  put: put,
  get: get,
  patch: patch
};

