'use strict';
const stub = require('sinon').stub;
const spy = require('sinon').spy;
const expect = require('chai')
  .use(require('sinon-chai'))
  .expect;
const proxyquire = require('proxyquire').noCallThru();
let proxyquireStubs = {};

const Hello = require('./../../../api/model/hello.js');

describe('For the HelloController expect', () => {
  describe('/get?name={name}', () => {
    beforeEach('setup spies', () => {
      this.resStub = stub();
      this.helloSpy = spy(Hello);
      proxyquireStubs['./../model/hello.js'] = this.helloSpy;
      this.greetSpy = spy(Hello.prototype, 'greet');
    });
    beforeEach('make call', () => {
      const helloController = proxyquire(
        './../../../api/controllers/helloController.js',
        proxyquireStubs);
      this.name = 'Bryce';
      helloController.get({
        swagger: { params: { name: { value: this.name } } }
      }, { send: this.resStub });
    });
    afterEach('teardown spies', () => {
      this.greetSpy.restore();
    });
    it('to delegate to the model', () => {
      expect(this.helloSpy).to.have.been.calledWithNew;
      expect(this.helloSpy).to.have.been.calledWith(this.name);
      expect(this.greetSpy).to.have.been.called;
    });
    it('to greet the user with the given name', () => {
      expect(this.resStub).to.have.been.calledWith(`Hello, ${this.name}!`);
    });
  });
});
