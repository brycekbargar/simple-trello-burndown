'use strict';

const sinon = require('sinon');
const stub = sinon.stub;
require('sinon-as-promised');
const expect = require('./../../chai.js').expect;
const superagent = require('superagent');
const mock = require('superagent-mocker')(superagent);
const tbd = require('tbd');
const proxyquire = require('proxyquire').noCallThru();
const moment = require('moment');

describe('[Workers] Expect CardHistory', () => {
  beforeEach('setup spies', () => {
    this.proxyquireStubs = {
      'superagent': superagent,
      './../../config/config.js': this.config = {
        trello: {
          key: 'Pecan',
          token: 'Waffles',
          board: 'trnaei15612itnaruyn',
          label: 'nteisroanteirsao'
        }
      }
    };
  });
  beforeEach('setup model', () => {
    this.CardHistory = proxyquire('./../../../workers/model/cardHistory.js', this.proxyquireStubs);
  });
  beforeEach('setup client', done => {
    require('./../../../index.js').scraper(require('./../../../api/swagger/swagger.json'))
    .then(s => {
      this.client = s.client;
      done();
    });
  });
  beforeEach('setup spies', () => {
    this.postStub = stub(this.client.apis.default, 'post_CardHistory');
    this.getStub = stub(this.client.apis.default, 'get_CardHistory');
    this.orphansStub = stub(this.client.apis.default, 'orphans');
  });
  afterEach('teardown spies', () => {
    this.postStub.restore();
    this.getStub.restore();
    this.orphansStub.restore();
  });
  describe('.scrapeTrello()', () => {
    afterEach('teardown trello api', () => {
      mock.clearRoutes();
    });
    it('to only return CardHistories that have the configured label', done => {
      const labels = [
        ['atnseraio', '156231'], 
        ['tneia156123', this.config.trello.label], 
        ['atnseraio', 'nuytsnreiao'], 
        ['nuynei1561ei', this.config.trello.label, 'ntuyranei'], 
        [], 
        [this.config.trello.label]
      ];
      const cardHistories = tbd.from({
        id: '573dae4684a6c99302523096'
      })
      .prop('shortLink').use(tbd.utils.range(1, 156123)).done()
      .prop('idList').use(tbd.utils.random('atnseraio', '156231', 'tneia156123')).done()
      .make(labels.length)
      .map((t, i) => Object.assign({}, t, { idLabels: labels[i] }));

      mock.get(`/boards/${this.config.trello.board}/cards`, () => {
        return {
          body: cardHistories
        };
      });
      expect(this.CardHistory.scrapeTrello())
      .to.eventually.be.fulfilled
      .and.to.eventually.have.length(3)
      .and.to.eventually.all.be.an.instanceOf(this.CardHistory)
      .and.to.eventually.all.have.property('cardLink')
      .and.also.to.eventually.all.have.property('listId')
      .notify(done);
    });
    it('to pass-through errors', done => {
      const error = new Error('BLAAAARGH');
      mock.get(`/boards/${this.config.trello.board}/cards`, () => {
        throw error;
      });
      expect(this.CardHistory.scrapeTrello())
      .to.eventually.be.rejectedWith(error)
      .notify(done);
    });
  });

  describe('.upload()', () => {
    it('to upload the cardHistories', done => {
      const cardHistories = tbd.from({}).make(3).map(ch => new this.CardHistory(ch));
      this.postStub.resolves();
      this.CardHistory.upload(this.client, cardHistories)
        .then(() => {
          expect(this.postStub).to.have.been.calledOnce;
          expect(this.postStub).to.have.been.calledWith({
            updates: cardHistories
          });
          done();
        })
        .catch(done);
    });
    it('to pass-through errors', done => {
      const error = new Error('BLAAAARGH');
      this.postStub.rejects(error);
      expect(this.CardHistory.upload(this.client, []))
      .to.eventually.be.rejectedWith(error)
      .notify(done);
    });
  });

  describe('.listOrphans()', () => {
    it('to list the orphans', done => {
      const orphans = tbd.from({})
        .prop('cardNo').use(tbd.utils.range(1, 1563)).done()
        .make(7)
        .concat(tbd.from({})
        .prop('listId').use(tbd.utils.range(1, 456321)).done()
        .make(3));
      this.orphansStub.resolves({ obj: orphans });
      expect(this.CardHistory.listOrphans(this.client))
      .to.eventually.be.fulfilled
      .and.to.eventually.have.length(orphans.length)
      .and.to.eventually.all.be.an.instanceOf(this.CardHistory)
      .notify(done);
    });
    it('to pass-through errors', done => {
      const error = new Error('BLAAAARGH');
      this.orphansStub.rejects(error);
      expect(this.CardHistory.listOrphans(this.client))
      .to.eventually.be.rejectedWith(error)
      .notify(done);
    });
  });

  describe('.getRecentHistory()', () => {
    it('to request two days of CardHistory', done => {
      this.getStub.resolves([]);
      this.CardHistory.getRecentHistory(this.client)
        .then(() => {
          expect(this.getStub)
          .to.have.been.calledOnce
          .and.to.all.satisfy(ch => ch instanceof this.CardHistory)
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
      expect(this.CardHistory.getRecentHistory(this.client))
      .to.eventually.be.rejectedWith(error)
      .notify(done);
    });
  });
});
