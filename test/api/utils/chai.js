'use strict';

module.exports = 
  require('chai')
  .use(require('chai-things'))
  .use(require('chai-http'))
  .use(require('sinon-chai'))
  .use(require('chai-as-promised'));
