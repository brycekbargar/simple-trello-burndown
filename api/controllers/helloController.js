'use strict';
const Hello = require('./../model/hello.js');

function hello(req, res) {
  var hello = new Hello(req.swagger.params.name.value);
  res.send(hello.greet());
}

module.exports = {
  get: hello
};
