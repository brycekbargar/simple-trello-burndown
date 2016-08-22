'use strict';
const stub = require('sinon').stub;
const expect = require('chai')
  .use(require('sinon-chai'))
  .expect;

const helloController = require('./../../../api/controllers/helloController.js');

describe('For the HelloController expect', () => {
  describe('/get?name={name}', () => {
    it('to greet the user with the given name', () => {
      const resStub = stub();
      
      helloController.get({
        swagger: { params: { name: { value: 'Name' } } }
      }, { json: resStub });

      expect(resStub).to.have.been.calledWith('Hello, Name!');
    });
  });
});
