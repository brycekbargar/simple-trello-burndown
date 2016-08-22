'use strict';
const util = require('util');

const Hello = function(name) {
  const model = this;
  model.name = name || 'stranger';
 
  model.greet = () => util.format('Hello, %s!', model.name);
};

module.exports = Hello;
