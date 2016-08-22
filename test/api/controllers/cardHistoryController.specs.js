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

describe('Expect cardHistoryController', () => {
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
  describe('/get', () => {
    beforeEach('setup spies', () => {
      this.resSpy = spy();
      this.listSpy = stub(CardHistory, 'list');
      this.listSpy.returns(
        this.cardHistories = [
          { date: '4/1/2016', status: 'backlog' },
          { date: '4/2/2016', status: 'backlog' },
          { date: '4/3/2016', status: 'dev' },
          { date: '4/4/2016', status: 'dev' },
          { date: '4/5/2016', status: 'qa' },
          { date: '4/6/2016', status: 'done' },
        ]);
      proxyquireStubs['./../model/cardHistory.js'] = CardHistory;
    });
    beforeEach('make call', () => {
      proxyquire('./../../../api/controllers/cardHistoryController.js', proxyquireStubs)
        .get({}, { send: this.resSpy });
    });
    afterEach('teardown spies', () => {
      this.listSpy.restore();
    });
    it('to delegate it to the model', () => {
      expect(this.listSpy).to.have.been.calledOnce;
    });
    it('to return the histories', () => {
      expect(this.resSpy).to.have.been.calledWith(200, this.cardHistories);
    });
  });
});
