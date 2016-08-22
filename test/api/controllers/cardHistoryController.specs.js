'use strict';
const sinon = require('sinon');
const stub = sinon.stub;
const spy = sinon.spy;
const expect = require('chai')
  .use(require('sinon-chai'))
  .expect;
const params = require('./../utils/swaggerParams.js');
const proxyquire = require('proxyquire').noCallThru();
let proxyquireStubs = {};

const CardHistory = require('./../../../api/model/cardHistory.js');

describe('For the CardHistoryController expect', () => {
  describe('/post', () => {
    beforeEach('setup spies', () => {
      this.resSpy = spy();
      this.bulkCreateStub = stub(CardHistory, 'bulkCreate');
      this.cardHistorySpy = spy(CardHistory);
      proxyquireStubs['./../model/cardHistory.js'] = this.cardHistorySpy;
    });
    beforeEach('make call', () => {
      this.updates = [
        { cardNo: 1, listId: 1 },
        { cardNo: 2, listId: 2 },
        { cardNo: 3, listId: 3 },
        { cardNo: 5, listId: 5 },
        { cardNo: 8, listId: 8 },
      ];
      proxyquire('./../../../api/controllers/cardHistoryController.js', proxyquireStubs)
        .post(params([{
          name: 'updates',
          value: this.updates
        }]), { 
          send: this.resSpy 
        });
    });
    afterEach('teardown spies', () => {
      this.bulkCreateStub.restore();
    });
    it('to delegate to the model', () => {
      expect(this.cardHistorySpy).to.have.been.calledWithNew;
      expect(this.cardHistorySpy).to.have.callCount(this.updates.length);
      expect(this.bulkCreateStub).to.have.been.calledWithMatch(
        sinon.match(updates => 
            Array.isArray(updates) &&
            updates.length === this.updates.length &&
            updates.reduce((p, u)  => p && u instanceof CardHistory)));
    });
    it('to be ok', () => {
      expect(this.resSpy).to.have.been.calledWith(204);
    });
  });
});
