const expect = require('chai').expect;
const scraper = require('./../../index.js').scraper;
const proxyquire = require('proxyquire').noCallThru();

describe('Expect scraper', () => {
  beforeEach('setup client', done => {
    scraper(require('./../../api/swagger/swagger.json'))
      .then(s => {
        this.client = s.client;
        done();
      });
  });
  beforeEach('setup spies', () => {
    this.proxyquireStubs = {};
  });
  beforeEach('setup scraper', () => {
    this.start = proxyquire('./../../workers/scraper.js', this.proxyquireStubs);
  });
  describe('#start()', () => {
    it('to be ok', () => {
      expect(true).to.be.ok;
    });
  });
});
