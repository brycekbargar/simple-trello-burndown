'use strict';
const chai = require('./../utils/chai.js');
const expect = chai.expect;
const sinon = require('sinon');
const tbd = require('tbd');

const model = require('./../../../api/model/model.js');
const start = require('./../../../index.js').web;

describe('Expect /api/cardHistory', () => {
  before('setup spies', () => {
    this.CardHistoryStub = sinon.stub(model, 'CardHistory');
    this.CardHistoryStub.returns(() => sinon.createStubInstance(model.CardHistory));
    this.bulkCreateStub = sinon.stub(model.CardHistory, 'bulkCreate');
  });
  after('teardown spies', () => {
    this.bulkCreateStub.restore();
    this.CardHistoryStub.restore();
  });
  afterEach('reset spies', () => {
    this.bulkCreateStub.reset();
    this.bulkCreateStub.resetBehavior();
    this.CardHistoryStub.reset();
  });

  before('setup server', () => start().then(s => this.app = s.app));

  describe('POST /', () => {
    describe('with valid data', done => {
      it('to be ok', () => {
        const cardHistories = tbd.from({
          listId: 1
        })
        .prop('cardNo').use(tbd.utils.range(1, 1563316)).done()
        .make(15);

        expect(chai.request(this.app)
          .post('/api/CardHistory')
          .send(cardHistories))
        .to.eventually.have.status(201)
        .notify(done);
      });
    });
  });
});
