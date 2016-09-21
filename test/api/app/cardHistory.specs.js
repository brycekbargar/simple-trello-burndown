'use strict';
const chai = require('./../../chai.js');
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');
const tbd = require('tbd');

const model = require('./../../../api/model/model.js');

describe('[Web] Expect /api/cardHistory', () => {
  before('setup spies', () => {
    this.CardHistorySpy = sinon.spy(model, 'CardHistory');
    this.bulkCreateStub = sinon.stub(model.CardHistory, 'bulkCreate');
    this.listStub = sinon.stub(model.CardHistory, 'list');
    this.listOrphansStub = sinon.stub(model.CardHistory, 'listOrphans');
  });
  after('teardown spies', () => {
    this.bulkCreateStub.restore();
    this.listStub.restore();
    this.listOrphansStub.restore();
    this.CardHistorySpy.restore();
  });
  afterEach('reset spies', () => {
    this.bulkCreateStub.reset();
    this.listStub.reset();
    this.listOrphansStub.reset();
    this.bulkCreateStub.resetBehavior();
    this.listStub.resetBehavior();
    this.listOrphansStub.resetBehavior();
    this.CardHistorySpy.reset();
  });

  before('setup server', () => {
    this.key = 'A Key';
    require('./../../../config/config.js').ScraperKey = this.key;
    return require('./../../../index.js').web().then(s => this.app = s.app);
  });

  describe('/ POST', () => {
    beforeEach('setup cardHistories', () => {
      this.cardHistories = tbd.from({
        listId: '4eea4ffc91e31d174600004a'
      })
      .prop('cardLink').use(tbd.utils.random(
        'neits',
        'ntuyr',
        'wluy',
        'tnuya',
        'enaro',
        '156ietna',
        '123ao')).done()
      .make(7);
    });
    it('with valid data to be ok', done => {
      this.bulkCreateStub.resolves();
      expect(chai.request(this.app)
        .post('/api/CardHistory')
        .set('apikey', this.key)
        .send(this.cardHistories))
      .to.eventually.have.status(204)
      .notify(done);
    });
    it('with invalid data to return validation errors', done => {
      expect(chai.request(this.app)
        .post('/api/CardHistory')
        .set('apikey', this.key)
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
        .set('apikey', this.key)
        .send(this.cardHistories)
        .then(() => {
          expect(this.bulkCreateStub).to.have.been.calledOnce;
          expect(this.bulkCreateStub.args[0][0])
            .to.have.length(this.cardHistories.length)
            .and.to.all.be.an.instanceOf(model.CardHistory);
          expect(this.cardHistories
            .every(ch => this.bulkCreateStub.args[0][0]
              .find(c => 
                c.card_link == ch.cardLink &&
                c.list_id === ch.listId)))
          .to.be.true;
        });
    });
    it('to forward exceptions', done => {
      const message = 'Nutella crepes';
      this.bulkCreateStub.rejects(new Error(message));
      expect(chai.request(this.app)
        .post('/api/CardHistory')
        .set('apikey', this.key)
        .send(this.cardHistories).then(() => {})
        .catch(err => err.response))
      .to.eventually.have.status(500)
      .to.eventually.have.deep.property('body.message', message)
      .notify(done);
    });
    it('to require Scraper permissions', done => {
      expect(chai.request(this.app)
        .post('/api/CardHistory')
        .send({}).then(() => {})
        .catch(err => err.response))
      .to.eventually.have.status(401)
      .notify(done);
    });
  });
  describe('/ GET', () => {
    it('to list the CardHistories', done => {
      const cardHistories = tbd.from({})
        .prop('cardLink').use(tbd.utils.range(1, 156123)).done()
        .prop('listId').use(tbd.utils.random(
          '4eea4ffc91e31d174600004a',
          'afen564331e31d174600004a',
          'afen564bc4531d174600004a'
        )).done()
        .make(4)
        .map(ch => new model.CardHistory(ch));
      this.listStub.resolves(cardHistories);
      chai.request(this.app)
        .get('/api/CardHistory')
        .set('apikey', this.key)
        .then(res => {
          expect(res).to.have.status(200);
          expect(cardHistories.every(ch => 
            res.body.find(r => 
              r.cardLink == ch.cardLink &&
              r.listId === ch.listId)));
          done();
        });
    });
    it('to forward exceptions', done => {
      const message = 'Pecan Waffles';
      this.listStub.rejects(new Error(message));
      expect(chai.request(this.app)
        .get('/api/CardHistory')
        .set('apikey', this.key).then(() => {})
        .catch(err => err.response))
      .to.eventually.have.status(500)
      .to.eventually.have.deep.property('body.message', message)
      .notify(done);
    });
    it('to require Scraper permissions', done => {
      expect(chai.request(this.app)
        .get('/api/CardHistory').then(() => {})
        .catch(err => err.response))
      .to.eventually.have.status(401)
      .notify(done);
    });
  });
  describe('/orphans GET', () => {
    it('to list the Orphans', done => {
      const cardHistories = tbd.from({})
        .prop('cardLink').use(tbd.utils.range(1, 156123)).done()
        .make(4)
        .map(ch => new model.CardHistory(ch));
      this.listOrphansStub.resolves(cardHistories);
      chai.request(this.app)
        .get('/api/CardHistory/orphans')
        .set('apikey', this.key)
        .then(res => {
          expect(res).to.have.status(200);
          expect(cardHistories.every(ch => 
            res.body.find(r => r.cardLink == ch.cardLink)));
          done();
        });
    });
    it('to forward exceptions', done => {
      const message = 'Banana Pancakes';
      this.listOrphansStub.rejects(new Error(message));
      expect(chai.request(this.app)
        .get('/api/CardHistory/orphans')
        .set('apikey', this.key).then(() => {})
        .catch(err => err.response))
      .to.eventually.have.status(500)
      .to.eventually.have.deep.property('body.message', message)
      .notify(done);
    });
    it('to require Scraper permissions', done => {
      expect(chai.request(this.app)
        .get('/api/CardHistory/orphans').then(() => {})
        .catch(err => err.response))
      .to.eventually.have.status(401)
      .notify(done);
    });
  });
});
