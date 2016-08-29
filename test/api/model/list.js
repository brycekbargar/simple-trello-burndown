'use strict';
const expect = require('chai')
  .use(require('chai-things'))
  .use(require('chai-as-promised'))
  .expect;
const proxyquire = require('proxyquire').noCallThru();

const knexFactory = require('./../utils/knexFactory.js')();

describe('Expect List', () => {
  beforeEach('setup proxyquire', () => this.proxyquireStubs = {});

  beforeEach('setup knex', () => knexFactory(this));
  afterEach('teardown knex', () => this.knex.destroy());

  beforeEach('setup List', () => {
    this.List = proxyquire('./../../../api/model/list.js', this.proxyquireStubs);
  });

  describe('.createOrReplace', () => {
    beforeEach('setup test list', () => this.testList = {
      id: 5,
      name: 'Test List',
      order: 7,
      status: 'qa'
    });
    
    it('to return true for new rows', done => {
      expect(this.List.createOrReplace(this.testList))
      .to.eventually.be.true
      .notify(done);
    });
    it('to return false for replaced rows', done => {
      expect(
        this.knex.insert(this.testList).into('lists')
        .then(() => this.List.createOrReplace(this.testList)))
      .to.eventually.be.false
      .notify(done);
    });

    it('to allow saving lists without statuses', done => {
      delete this.testList.status;
      expect(
        this.List
        .createOrReplace(this.testList)
        .then(() => this.knex.count('id as count').from('lists').where(this.testList))
        .then(rows => rows[0].count))
      .to.eventually.equal(1)
      .notify(done);
    });
    it('to save new rows', done => {
      expect(
        this.List
        .createOrReplace(this.testList)
        .then(() => this.knex.count('id as count').from('lists').where(this.testList))
        .then(rows => rows[0].count))
      .to.eventually.equal(1)
      .notify(done);
    });
    it('to replace rows', done => {
      const updatedList = {
        id: this.testList.id,
        name: 'A new name',
        order: 4816
      };
      expect(
        this.knex.insert(this.testList).into('lists')
        .then(() => this.List.createOrReplace(updatedList))
        .then(() => this.knex.count('id as count').from('lists').where(updatedList))
        .then(rows => rows[0].count))
      .to.eventually.equal(1)
      .notify(done);
    });
    it('to not partially replace', done => {
      const updatedList = {
        id: this.testList.id,
      };
      expect(
        this.knex.insert(this.testList).into('lists')
        .then(() => this.List.createOrReplace(updatedList))
        .catch(() => this.knex.count('id as count').from('lists').where(this.testList))
        .then(rows => rows[0].count))
      .to.eventually.equal(1)
      .notify(done);
    });

  });
});
