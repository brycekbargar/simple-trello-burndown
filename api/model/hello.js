'use strict';
const util = require('util');

function Hello(name) {
  this.name = name || 'stranger';
}

Hello.prototype.greet = function() {
  return util.format('Hello, %s!', this.name);
};

module.exports = Hello;
