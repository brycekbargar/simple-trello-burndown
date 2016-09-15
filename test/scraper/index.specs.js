const stub = require('sinon').stub;
require('sinon-as-promised');
const tbd = require('tbd');
const expect = require('./../chai.js').expect;

const scraper = require('./../../workers/scraper/index.js');
const CardHistory = require('./../../workers/scraper/model/cardHistory.js');

describe('[Scraper] Expect scraper', () => {
  beforeEach('setup spies', () => {
    this.scrapeTrelloStub = stub(CardHistory, 'scrapeTrello');
    this.uploadStub = stub(CardHistory, 'upload');
    this.orphansStub = stub(CardHistory, 'listOrphans');
  });
  afterEach('teardown spise', () => {
    this.scrapeTrelloStub.restore();
    this.uploadStub.restore();
    this.orphansStub.restore();
  });
  it('to run', done => {
    const client = {};
    const cardHistories = tbd.from({}).make(7).map(ch => new CardHistory(ch));
    this.scrapeTrelloStub.resolves(cardHistories);
    this.uploadStub.resolves();
    this.orphansStub.resolves([]);
    scraper(client)
      .then(() => {
        expect(this.scrapeTrelloStub).to.have.been.calledOnce;
        expect(this.uploadStub).to.have.been.calledOnce;
        expect(this.uploadStub).to.have.been.calledWith(client, cardHistories);
        expect(this.orphansStub).to.have.been.calledOnce;
        expect(this.orphansStub).to.have.been.calledWith(client);
        done();
      })
      .catch(done);
  });
});
