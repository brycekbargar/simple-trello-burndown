const expect = require('./../../chai.js').expect;
const superagent = require('superagent');
const mock = require('superagent-mocker')(superagent);
const proxyquire = require('proxyquire').noCallThru();

describe('[Scraper] Expect CardHistory', () => {
  beforeEach('setup spies', () => {
    this.proxyquireStubs = {
      'superagent': superagent,
      './../config/config.js': this.config = {
        trelloKey: 'Pecan',
        trelloToken: 'Waffles',
        trelloBoard: 'trnaei15612itnaruyn'
      }
    };
  });
  beforeEach('setup model', () => {
    this.CardHistory = proxyquire('./../../../workers/scraper/model/cardHistory.js', this.proxyquireStubs);
  });
  describe('.list()', () => {
    beforeEach('setup trello api', () => {
      mock.get(`/boards/${this.config.trelloBoard}/cards`, () => {
        return { a: 5 };
      });
    });
    afterEach('teardown trello api', () => {
      mock.clearRoutes();
    });
    it('to grab the card histories from trello', done => {
      this.CardHistory.list()
        .then(() => {
          expect(true).to.be.ok;
          done();
        })
        .catch(() => {
          expect(false).to.be.ok;
          done();
        });
    });
  });
});
