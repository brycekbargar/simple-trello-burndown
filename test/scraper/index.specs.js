'use strict';

const stub = require('sinon').stub;
require('sinon-as-promised');
const tbd = require('tbd');
const expect = require('./../chai.js').expect;
const g = require('./../generate.js');

const scraper = require('./../../workers/scraper/index.js');
const CardHistory = require('./../../workers/scraper/model/cardHistory.js');
const List = require('./../../workers/scraper/model/list.js');
const Card = require('./../../workers/scraper/model/card.js');

describe('[Scraper] Expect scraper', () => {
  beforeEach('setup spies', () => {
    this.scrapeTrelloStub = stub(CardHistory, 'scrapeTrello');
    this.uploadStub = stub(CardHistory, 'upload');
    this.orphansStub = stub(CardHistory, 'listOrphans');
    this.list_getFromTrelloStub = stub(List, 'getFromTrello');
    this.list_uploadStub = stub(List, 'upload');
    this.card_getFromTrelloStub = stub(Card, 'getFromTrello');
    this.card_uploadStub = stub(Card, 'upload');
  });
  afterEach('teardown spise', () => {
    this.scrapeTrelloStub.restore();
    this.uploadStub.restore();
    this.orphansStub.restore();
    this.list_getFromTrelloStub.restore();
    this.list_uploadStub.restore();
    this.card_getFromTrelloStub.restore();
    this.card_uploadStub.restore();
  });
  it('to run', done => {
    const client = {};
    const cardHistories = tbd.from({}).make(7).map(ch => new CardHistory(ch));
    this.scrapeTrelloStub.resolves(cardHistories);
    this.uploadStub.resolves();
    const listOrphans = tbd.from({})
      .prop('listId').use(tbd.utils.random.apply(null, g.enerate(7, g.listIds))).done()
      .make(3);
    const cardOrphans = tbd.from({})
      .prop('cardLink').use(tbd.utils.random.apply(null, g.enerate(7, g.cardLinks))).done()
      .make(8);
    this.orphansStub.resolves(listOrphans
      .concat(cardOrphans)
      .map(o => new CardHistory(o)));
    listOrphans.forEach((l, i) => this.list_getFromTrelloStub.onCall(i).resolves(l));
    cardOrphans.forEach((c, i) => this.card_getFromTrelloStub.onCall(i).resolves(c));
    this.list_uploadStub.resolves();
    this.card_uploadStub.resolves();
    scraper(client)
      .then(() => {
        expect(this.scrapeTrelloStub).to.have.been.calledOnce;
        expect(this.uploadStub).to.have.been.calledOnce;
        expect(this.uploadStub).to.have.been.calledWith(client, cardHistories);
        expect(this.orphansStub).to.have.been.calledOnce;
        expect(this.orphansStub).to.have.been.calledWith(client);
        expect(this.list_getFromTrelloStub).to.have.callCount(listOrphans.length);
        expect(this.card_getFromTrelloStub).to.have.callCount(cardOrphans.length);
        expect(listOrphans).to.all.satisfy(l => this.list_uploadStub.calledWith(client, l, l.listId));
        expect(cardOrphans).to.all.satisfy(c => this.card_uploadStub.calledWith(client, c, c.cardLink));
        done();
      })
      .catch(done);
  });
});
