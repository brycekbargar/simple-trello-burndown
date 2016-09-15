'use strict';
const expect = require('./../../chai.js').expect;
const tbd = require('tbd');
const proxyquire = require('proxyquire').noCallThru();

const knexFactory = require('./../knexFactory.js')();

describe('[Web] Expect CardHistory', () => {
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
      .prop('listId').use(tbd.utils.random(
        '4eea4ffc91e31d174600004a',
        '4eea4ffcafebcda74600004a',
        'l5623ffc91e31d174600004a',
        '4eea4ffc91e31d1745623145'
      )).done()
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
      .prop('listId').use(tbd.utils.random(
        '4eea4ffc91e31d174600004a',
        '4eea4ffcafebcda74600004a',
        'l5623ffc91e31d174600004a',
        '4eea4ffc91e31d1745623145'
      )).done()
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
        listId: '4eea4ffc91e31d174600004a'
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
        name: 'nutella crepes',
        order: 1
      })
      .prop('id').use(tbd.utils.sequential(3)).done()
      .make(3);

      lists[0].status = 'backlog';
      lists[1].status = null;
      lists[2].status = 'qa';

      this.knex.transaction(tx => 
        Promise.all([
          tx.insert(cardHistories).into('card_histories'),
          tx.insert(lists).into('lists')
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

  describe('.listOrphans()', () => {
    it('to return ids of missing lists and cards', done => {
      const cardHistories = tbd.from({})
      .prop('card_no').use(tbd.utils.sequential(3)).done()
      .prop('list_id').use(tbd.utils.sequential(5)).done()
      .make(7);
      const lists = tbd.from({
        name: 'nutella crepes', 
        order: 1
      })
      .prop('id').use(tbd.utils.sequential(4)).done()
      .make(7);
      const cards = tbd.from({
        name: 'banana pancakes',
        link: 'tp9KEvpi'
      })
      .prop('no').use(tbd.utils.sequential(2)).done()
      .make(7);

      this.knex.transaction(tx =>
        Promise.all([
          tx.insert(cardHistories).into('card_histories'),
          tx.insert(lists).into('lists'),
          tx.insert(cards).into('cards')
        ]))
      .then(() => expect(this.CardHistory.listOrphans())
        .to.eventually.have.length(2)
        .and.to.eventually.all.be.an.instanceOf(this.CardHistory)
        .and.to.eventually.include({listId: '11'})
        .and.to.eventually.include({cardNo: 9})
        .notify(done))
      .catch(done);
    });
  });
});
