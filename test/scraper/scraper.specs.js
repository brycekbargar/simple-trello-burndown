const expect = require('chai').expect;
const scraper = require('./../../index.js').scraper;

describe('Expect the Scraper', () => {
  describe('.start()', () => {
    it('to be ok', done => {
      scraper(require('./../../api/swagger/swagger.json'))
      .then(s => {
        expect(s.client).to.be.ok;
        done();
      })
      .catch(err => {
        console.log(err);
        expect(true).to.be.false;
        done();
      });
    });
  });
});
