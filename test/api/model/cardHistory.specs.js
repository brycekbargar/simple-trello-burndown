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
      proxyquireStubs['knex'] = knex; 
    })
    .then(done);
  });
  beforeEach('setup CardHistory', () => {
    this.CardHistory = proxyquire('./../../../api/model/cardHistory.js', proxyquireStubs);
  });
  describe('.bulkCreate()', () => {
    it('to insert the given CardHistories', done => {
      let cardHistories = tbd.from({})
      .prop('cardNo').use(tbd.utils.range(1, 100)).done()
      .prop('listId').use(tbd.utils.range(1, 100)).done()
      .make(tbd.utils.range(5, 10)())
      .map(x => new this.CardHistory(x));

      expect(
        this.CardHistory
          .bulkCreate(cardHistories)
          .then(() => this.knex('card_histories').count('card_no as count'))
          .then(r => r[0].count))
      .to.eventually.equal(cardHistories.length)
      .notify(done); 
    });
  });
});
