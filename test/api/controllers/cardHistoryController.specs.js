'use strict';
const stub = require('sinon').stub;
const spy = require('sinon').spy;
const expect = require('chai')
  .use(require('sinon-chai'))
  .expect;
const proxyquire = require('proxyquire').noCallThru();
let proxyquireStubs = {};

const CardHistory = require('./../../../api/model/cardHistory.js');

describe('For the CardHistoryController expect', () => {
  describe('/post', () => {
    beforeEach('setup spies', () => {
      this.resStub = stub();
      this.cardHistorySpy = spy(CardHistory);
      proxyquireStubs['./../model/cardHistory.js'] = this.cardHistorySpy;
    });
    beforeEach('make call', () => {
      this.updates = [{
        cardNo: 1,
        listId: 1
      }];
      proxyquire('./../../../api/controllers/cardHistoryController.js', proxyquireStubs)
        .post({
          swagger: { params: { updates: { value: this.updates } } }
        }, { send: this.resStub });
    });
    afterEach('teardown spies', () => {
    });
    it('to delegate to the model', () => {
      expect(this.cardHistorySpy).to.have.been.calledWithNew;
      expect(this.cardHistorySpy).to.have.been.calledWith(this.updates[0]);
    });
    it('to be ok', () => {
      expect(this.resStub).to.have.been.calledWith(204);
    });
  });
});
