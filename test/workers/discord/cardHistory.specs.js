'use strict';

const sinon = require('sinon');
const stub = sinon.stub;
require('sinon-as-promised');
const expect = require('./../../chai.js').expect;
const moment = require('moment');

const CardHistory = require('./../../../workers/discord/cardHistory.js');

describe('[Discord] Expect CardHistory', () => {
  beforeEach('setup client', done => {
    require('./../../../index.js').scraper(require('./../../../api/swagger/swagger.json'))
    .then(s => {
      this.client = s.client;
      done();
    });
  });
  beforeEach('setup spies', () => {
    this.getStub = stub(this.client.apis.default, 'get_CardHistory');
  });
  afterEach('teardown spies', () => {
    this.getStub.restore();
    this.getStub.resetBehavior();
  });

  describe('.getRecentHistory()', () => {
    it('to request two days of CardHistory', done => {
      this.getStub.resolves({ obj: [] });
      CardHistory.getRecentHistory(this.client)
        .then(() => {
          expect(this.getStub)
          .to.have.been.calledOnce
          .and.to.all.satisfy(ch => ch instanceof CardHistory)
          .and.to.have.been.calledWithMatch(query => 
            !!query.start && 
            moment(query.start).isValid() &&
            moment().add(-3, 'days') < moment(query.start));
          done();
        })
        .catch(done);
    });
    it('to pass-through errors', done => {
      const error = new Error('BLAAAARGH');
      this.getStub.rejects(error);
      expect(CardHistory.getRecentHistory(this.client))
      .to.eventually.be.rejectedWith(error)
      .notify(done);
    });
  });
});
