'use strict';
const expect = require('chai')
  .use(require('chai-things'))
  .use(require('chai-as-promised'))
  .expect;
const tbd = require('tbd');
const proxyquire = require('proxyquire').noCallThru();

const knexFactory = require('./../utils/knexFactory.js')();

describe('Expect CardHistory', () => {
  beforeEach('setup proxyquire', () => this.proxyquireStubs = {});

  beforeEach('setup knex', () => knexFactory(this));
  afterEach('teardown knex', () => this.knex.destroy());

  beforeEach('setup CardHistory', () => {
    this.CardHistory = proxyquire('./../../../api/model/cardHistory.js', this.proxyquireStubs);
  });

  describe('.bulkCreate()', () => {
    it('to insert the given CardHistories', done => {
      const cardHistories = tbd.from({})
      .prop('cardNo').use(tbd.utils.range(1, 10000)).done()
      .prop('listId').use(tbd.utils.range(1, 10000)).done()
      .make(tbd.utils.range(5, 10)());

      expect(
        this.CardHistory
        .bulkCreate(cardHistories.map(x => new this.CardHistory(x)))
        .then(() => this.knex.select().from('card_histories'))
        .then(rows => 
            cardHistories.every(ch => 
              rows.find(r => 
                !!r.created_at &&
                r.card_no === ch.cardNo &&
                r.list_id === ch.listId))))
      .to.eventually.be.true
      .notify(done); 
    });
    it('to not perform partial inserts', done => {
      const cardHistories = tbd.from({})
      .prop('cardNo').use(tbd.utils.range(1, 10000)).done()
      .prop('listId').use(tbd.utils.range(1, 10000)).done()
      .make(5)
      .map(x => new this.CardHistory(x));

      cardHistories.splice(2, 0, new this.CardHistory({}));

      expect(
        this.CardHistory
        .bulkCreate(cardHistories)
        .catch(() => this.knex('card_histories').count('card_no as COUNT'))
        .then(count => count[0].COUNT))
      .to.eventually.equal(0)
      .notify(done); 
    });
    it('to not not allow duplicates', done => {
      const cardHistories = tbd.from({
        cardNo: 1,
        listId: 1
      })
      .make(2)
      .map(x => new this.CardHistory(x));

      expect(this.CardHistory.bulkCreate(cardHistories))
      .to.be.rejected
      .notify(done); 
    });
  });

  describe('.list()', () => {
    it('to return CardHistories that have statuses', done => {
      const cardHistories = tbd.from({
        card_no: 1,
      })
      .prop('list_id').use(tbd.utils.sequential(1)).done()
      .make(7);
      const lists = tbd.from({
        name: 'blah',
        order: 1
      })
      .prop('id').use(tbd.utils.sequential(3)).done()
      .make(3);

      lists[0].status = 'backlog';
      lists[1].status = null;
      lists[2].status = 'qa';

      this.knex.transaction(tx => 
        Promise.all([
          Promise.all(cardHistories.map(ch => tx.insert(ch).into('card_histories'))),
          Promise.all(lists.map(l => tx.insert(l).into('lists')))
        ]))
        .then(() => expect(this.CardHistory.list())
          .to.eventually.have.length(2)
          .and.to.eventually.all.be.an.instanceOf(this.CardHistory)
          .and.to.eventually.all.have.property('status')
          .and.to.eventually.all.have.property('createdAt')
          .notify(done))
        .catch(done);
    });
  });
});
