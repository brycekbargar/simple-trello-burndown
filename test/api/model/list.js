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
    it('to be ok', done => {
      const list = new this.List({
        id: 5,
        name: 'Test List',
        order: 7,
        status: 'qa'
      });
      expect(this.List.createOrReplace(list))
      .to.eventually.be.ok
      .notify(done);
    });
  });
});
