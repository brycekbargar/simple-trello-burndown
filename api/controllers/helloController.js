'use strict';
const Hello = require('./../model/hello.js');

module.exports = {
  get: hello
};

function hello(req, res) {
  var hello = new Hello(req.swagger.params.name.value);
  res.json(hello.greet());
}
