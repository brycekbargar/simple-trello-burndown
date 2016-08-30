'use strict';
const chai = require('./../utils/chai.js');
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');
const tbd = require('tbd');

const model = require('./../../../api/model/model.js');
const start = require('./../../../index.js').web;

describe('Expect /api/cardHistory', () => {
  before('setup spies', () => {
    this.CardHistorySpy = sinon.spy(model, 'CardHistory');
    this.bulkCreateStub = sinon.stub(model.CardHistory, 'bulkCreate');
  });
  after('teardown spies', () => {
    this.bulkCreateStub.restore();
    this.CardHistorySpy.restore();
  });
  afterEach('reset spies', () => {
    this.bulkCreateStub.reset();
    this.bulkCreateStub.resetBehavior();
    this.CardHistorySpy.reset();
  });

  before('setup server', () => start().then(s => this.app = s.app));

  describe('POST /', () => {
    beforeEach('setup cardHistories', () => {
      this.cardHistories = tbd.from({
        listId: 1
      })
      .prop('cardNo').use(tbd.utils.range(1, 1563316)).done()
      .make(15);
    });
    it('with valid data to be ok', done => {
      this.bulkCreateStub.resolves();
      expect(chai.request(this.app)
        .post('/api/CardHistory')
        .send(this.cardHistories))
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
      .and.to.eventually.have.deep.property('body.message', 'Validation errors') 
      .and.also.eventually.have.deep.property('body.errors[0].code', 'INVALID_REQUEST_PARAMETER') 
      .notify(done);
    });
    it('to create the CardHistories', () => {
      this.bulkCreateStub.resolves();
      return chai.request(this.app)
        .post('/api/CardHistory')
        .send(this.cardHistories)
        .then(() => {
          expect(this.bulkCreateStub).to.have.been.calledOnce;
          expect(this.bulkCreateStub.args[0][0])
            .to.have.length(this.cardHistories.length)
            .and.to.all.be.an.instanceOf(model.CardHistory);
          expect(this.cardHistories
            .every(ch => this.bulkCreateStub.args[0][0]
              .find(c => 
                c.card_no === ch.cardNo &&
                c.list_id === ch.listId)))
          .to.be.true;
        });
    });
    it('to forward exceptions', done => {
      const message = 'Nutella crepes';
      this.bulkCreateStub.rejects(new Error(message));
      expect(chai.request(this.app)
        .post('/api/CardHistory')
        .send(this.cardHistories).then(() => {})
        .catch(err => err.response))
      .to.eventually.have.status(500)
      .to.eventually.have.deep.property('body.message', message)
      .notify(done);
    });
  });
});
