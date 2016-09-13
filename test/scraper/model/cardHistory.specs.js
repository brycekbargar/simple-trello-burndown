const expect = require('./../../chai.js').expect;
const superagent = require('superagent');
const mock = require('superagent-mocker')(superagent);
const tbd = require('tbd');
const proxyquire = require('proxyquire').noCallThru();

describe('[Scraper] Expect CardHistory', () => {
  beforeEach('setup spies', () => {
    this.proxyquireStubs = {
      'superagent': superagent,
      './../config/config.js': this.config = {
        trello: {
          key: 'Pecan',
          token: 'Waffles',
          board: 'trnaei15612itnaruyn',
          label: 'nteisroanteirsao'
        }
      }
    };
  });
  beforeEach('setup model', () => {
    this.CardHistory = proxyquire('./../../../workers/scraper/model/cardHistory.js', this.proxyquireStubs);
  });
  describe('.list()', () => {
    afterEach('teardown trello api', () => {
      mock.clearRoutes();
    });
    it('to only return CardHistories that have the configured label', done => {
      const labels = [
        ['atnseraio', '156231'], 
        ['tneia156123', this.config.trello.label], 
        ['atnseraio', 'nuytsnreiao'], 
        ['nuynei1561ei', this.config.trello.label || '156231', 'ntuyranei'], 
        [], 
        [this.config.trello.label || 'tnrsy']
      ];
      const cardHistories = tbd.from({
        id: '573dae4684a6c99302523096'
      })
      .prop('idShort').use(tbd.utils.range(1, 156123)).done()
      .prop('idList').use(tbd.utils.random('atnseraio', '156231', 'tneia156123')).done()
      .make(labels.length)
      .map((t, i) => Object.assign({}, t, { idLabels: labels[i] }));

      mock.get(`/boards/${this.config.trello.board}/cards`, () => {
        return {
          body: cardHistories
        };
      });
      expect(this.CardHistory.list())
      .to.eventually.be.fulfilled
      .to.eventually.have.length(3)
      .notify(done);
    });
    it('to pass-through errors', done => {
      const error = new Error('BLAAAARGH');
      mock.get(`/boards/${this.config.trello.board}/cards`, () => {
        throw error;
      });
      expect(this.CardHistory.list())
      .to.eventually.be.rejectedWith(error)
      .notify(done);
    });
  });
});
