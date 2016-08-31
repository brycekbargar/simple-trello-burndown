const expect = require('chai').expect;
const superagent = require('superagent');
const mock = require('superagent-mocker')(superagent);
const proxyquire = require('proxyquire').noCallThru();

describe('Expect scraper', () => {
  beforeEach('setup client', done => {
    require('./../../index.js').scraper(require('./../../api/swagger/swagger.json'))
      .then(s => {
        this.client = s.client;
        done();
      });
  });
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
  beforeEach('setup scraper', () => {
    this.start = proxyquire('./../../workers/scraper.js', this.proxyquireStubs);
  });
  describe('#start()', () => {
    it('to grab the card histories from trello', done => {
      mock.get(`/boards/${this.config.trelloBoard}/cards`, () => {
        return { a: 5 };
      });
      this.start(this.client)
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
