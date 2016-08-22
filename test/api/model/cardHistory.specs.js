'use strict';
const expect = require('chai')
  .use(require('chai-as-promised'))
  .expect;
const knexFactory = require('./../utils/knexFactory.js');
const proxyquire = require('proxyquire').noCallThru();
let proxyquireStubs = {};

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
      let cardHistories = [
        new this.CardHistory({
          cardNo: 1,
          listId: 1,
        }),
        new this.CardHistory({
          cardNo: 2,
          listId: 2,
        }),
        new this.CardHistory({
          cardNo: 3,
          listId: 3,
        }),
        new this.CardHistory({
          cardNo: 4,
          listId: 4,
        })];

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
