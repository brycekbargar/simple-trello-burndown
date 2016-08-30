'use strict';
const expect = require('./../utils/chai.js').expect;
const proxyquire = require('proxyquire').noCallThru();

const knexFactory = require('./../utils/knexFactory.js')();

describe('Expect Card', () => {
  beforeEach('setup proxyquire', () => this.proxyquireStubs = {});

  beforeEach('setup knex', () => knexFactory(this));
  afterEach('teardown knex', () => this.knex.destroy());

  beforeEach('setup Card', () => {
    this.Card = proxyquire('./../../../api/model/card.js', this.proxyquireStubs);
  });

  beforeEach('setup test card', () => {
    this.testCard = {
      no: 5,
      name: 'Test Card',
    };
    return this.knex.insert(this.testCard).into('cards');
  });

  describe('.createOrReplace()', () => {
    it('to return true for new rows', done => {
      this.testCard.no = 156;
      expect(this.Card.createOrReplace(this.testCard))
      .to.eventually.be.true
      .notify(done);
    });
    it('to return false for replaced rows', done => {
      expect(this.Card.createOrReplace(this.testCard))
      .to.eventually.be.false
      .notify(done);
    });

    it('to save new rows', done => {
      this.testCard.no = 156213;
      expect(
        this.Card
        .createOrReplace(this.testCard)
        .then(() => this.knex.count('no as count').from('cards').where(this.testCard))
        .then(rows => rows[0].count))
      .to.eventually.equal(1)
      .notify(done);
    });
    it('to replace rows', done => {
      const updatedCard = {
        no: this.testCard.no,
        name: 'A new name',
      };
      expect(
        this.Card.createOrReplace(updatedCard)
        .then(() => this.knex.count('no as count').from('cards').where(updatedCard))
        .then(rows => rows[0].count))
      .to.eventually.equal(1)
      .notify(done);
    });
    it('to not partially replace', done => {
      const updatedCard = {
        no: this.testCard.no,
      };
      expect(
        this.Card.createOrReplace(updatedCard)
        .catch(() => this.knex.count('no as count').from('cards').where(this.testCard))
        .then(rows => rows[0].count))
      .to.eventually.equal(1)
      .notify(done);
    });
  });
});
