'use strict';
const chai = require('./../utils/chai.js');
const expect = chai.expect;


describe('Expect /api/hello', () => {
  beforeEach('setup server', done => {
    require('./../../../index.js').web()
    .then(w => this.app = w.app)
    .then(() => done());
  });
  describe('GET /', () => {
    it('to greet a stranger', done => {
      expect(chai.request(this.app).get('/api/hello'))
      .to.eventually.have.status(200)
      .to.be.json
      .to.have.property('body', 'Hello, stranger!')
      .notify(done);
    });
    it('to greet someone by name', done => {
      const name = 'Bryce';
      expect(chai.request(this.app)
        .get('/api/hello')
        .query({
          name: name
        }))
      .to.eventually.have.status(200)
      .to.be.json
      .to.have.property('body', `Hello, ${name}!`)
      .notify(done);
    });
  });
});
