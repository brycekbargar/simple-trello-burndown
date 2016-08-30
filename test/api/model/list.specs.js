'use strict';
const expect = require('./../utils/chai.js').expect;
const tbd = require('tbd');
const proxyquire = require('proxyquire').noCallThru();

const knexFactory = require('./../utils/knexFactory.js')();

describe('Expect List', () => {
  beforeEach('setup proxyquire', () => this.proxyquireStubs = {});

  beforeEach('setup knex', () => knexFactory(this));
  afterEach('teardown knex', () => this.knex.destroy());

  beforeEach('setup List', () => {
    this.List = proxyquire('./../../../api/model/list.js', this.proxyquireStubs);
  });

  beforeEach('setup test list', () => {
    this.testList = {
      id: 5,
      name: 'Test List',
      order: 7,
      status: 'qa'
    };
    return this.knex.insert(this.testList).into('lists');
  });

  describe('.createOrReplace()', () => {
    it('to return true for new rows', done => {
      this.testList.id = 156;
      expect(this.List.createOrReplace(this.testList))
      .to.eventually.be.true
      .notify(done);
    });
    it('to return false for replaced rows', done => {
      expect(this.List.createOrReplace(this.testList))
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
      this.testList.id = 156213;
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
        this.List.createOrReplace(updatedList)
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
        this.List.createOrReplace(updatedList)
        .catch(() => this.knex.count('id as count').from('lists').where(this.testList))
        .then(rows => rows[0].count))
      .to.eventually.equal(1)
      .notify(done);
    });
  });
  describe('.update()', () => {
    it('to partially update properties', done => {
      const updatedList = {
        id: this.testList.id,
        order: 4816
      };
      expect(
        this.List.update(updatedList)
        .then(() => this.knex
          .count('id as count')
          .from('lists')
          .where({
            id: this.testList.id,
            name: this.testList.name,
            order: updatedList.order,
            status: this.testList.status
          }))
        .then(rows => rows[0].count))
      .to.eventually.equal(1)
      .notify(done);
    });
    describe('to correctly report when', () => {
      it('the list was updated', done => {
        expect(this.List.update(this.testList))
        .to.eventually.be.true
        .notify(done);
      });
      it('the list was not found', done => {
        const list = new this.List({
          id: 1564231
        });
        expect(this.List.update(list))
        .to.eventually.be.false
        .notify(done);
      });
    });
  });

  describe('.list()', () => {
    it('to return all the lists', done => {
      const testLists = tbd.from({
        status: 'qa',
      })
      .prop('order').use(tbd.utils.range(156, 456)).done()
      .prop('name').use(tbd.utils.range(15, 351)).done()
      .prop('id').use(tbd.utils.range(1, 10000)).done()
      .make(12);

      expect(
        this.knex.insert(testLists).into('lists')
        .then(() => this.List.list())
        .then(lists => 
          testLists.every(tl =>
            lists.find(l => 
              tl.id === l.id &&
              tl.status === l.status &&
              tl.name == l.name &&
              tl.order === l.order))))
        .to.eventually.be.true
        .notify(done);
    });
  });
});
