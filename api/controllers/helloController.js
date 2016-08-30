'use strict';
const Hello = require('./../model/model.js').Hello;

const greet = (req, res) => {
  var hello = new Hello(req.swagger.params.name.value);
  res.send(Hello.greet(hello));
};

module.exports = {
  get: greet
};
