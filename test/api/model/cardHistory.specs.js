'use strict';
const expect = require('chai')
  .use(require('chai-as-promised'))
  .expect;
const tbd = require('tbd');
const proxyquire = require('proxyquire').noCallThru();
let proxyquireStubs = {};

const knexFactory = require('./../utils/knexFactory.js');

describe('Expect CardHistory', () => {
  beforeEach('setup knex', done => {
    knexFactory()
    .then(knex => { 
      this.knex = knex; 
      proxyquireStubs['./knexFactory.js'] = () => knex; 
    })
    .then(done);
  });
  beforeEach('setup CardHistory', () => {
    this.CardHistory = proxyquire('./../../../api/model/cardHistory.js', proxyquireStubs);
  });
  describe('.bulkCreate()', () => {
    it('to insert the given CardHistories', done => {
      let cardHistories = tbd.from({})
      .prop('cardNo').use(tbd.utils.range(1, 10000)).done()
      .prop('listId').use(tbd.utils.range(1, 10000)).done()
      .make(tbd.utils.range(5, 10)())
      .map(x => new this.CardHistory(x));

      expect(
        this.CardHistory
          .bulkCreate(cardHistories)
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
      let cardHistories = tbd.from({})
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
      let cardHistories = tbd.from({
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
});
