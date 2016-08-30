'use strict';
const util = require('util');

function Hello(name) {
  this.name = name || 'stranger';
}

Hello.greet = (hello) => util.format('Hello, %s!', hello.name);

module.exports = Hello;
