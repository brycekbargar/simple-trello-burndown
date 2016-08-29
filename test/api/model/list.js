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
      expect(
        this.List
        .createOrReplace())
      .to.eventually.be.ok
      .notify(done);
    });
  });
});
