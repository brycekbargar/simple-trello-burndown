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
    it('with valid data to be ok', done => {
      const cardHistories = tbd.from({
        listId: 1
      })
      .prop('cardNo').use(tbd.utils.range(1, 1563316)).done()
      .make(15);

      expect(chai.request(this.app)
        .post('/api/CardHistory')
        .send(cardHistories))
      .to.eventually.have.status(204)
      .notify(done);
    });
    it('with invalid data to return validation errors', done => {
      expect(chai.request(this.app)
        .post('/api/CardHistory')
        .send({ banana: 'pancakes' }).then(() => {})
        .catch(err => err.response))
      .to.eventually.have.status(400)
      .and.to.eventually.be.json
      .and.to.eventually.have.deep.property('body.message', 'Validation Errors') 
      .and.also.eventually.have.deep.property('body.errors[0].code', 'INVALID_REQUEST_PARAMETER') 
      .notify(done);
    });
  });
});
