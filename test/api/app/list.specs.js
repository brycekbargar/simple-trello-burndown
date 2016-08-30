'use strict';
const chai = require('./../utils/chai.js');
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');
const tbd = require('tbd');

const model = require('./../../../api/model/model.js');
const start = require('./../../../index.js').web;

describe('Expect /api/lists', () => {
  before('setup spies', () => {
    this.ListSpy = sinon.spy(model, 'List');
    this.createOrReplaceStub = sinon.stub(model.List, 'createOrReplace');
    this.listStub = sinon.stub(model.List, 'list');
    this.updateStub = sinon.stub(model.List, 'update');
  });
  after('teardown spies', () => {
    this.createOrReplaceStub.restore();
    this.listStub.restore();
    this.updateStub.restore();
    this.ListSpy.restore();
  });
  afterEach('reset spies', () => {
    this.createOrReplaceStub.reset();
    this.listStub.reset();
    this.updateStub.reset();
    this.createOrReplaceStub.resetBehavior();
    this.listStub.resetBehavior();
    this.updateStub.resetBehavior();
    this.ListSpy.reset();
  });

  before('setup server', () => start().then(s => this.app = s.app));

  describe('/{listId} PUT', () => {
    beforeEach('setup list', () => {
      this.list = {
        order: 15644,
        name: 'Blueberry Scone'
      };
      this.listId = 456123;
    });
    it('to report creating a new list', done => {
      this.createOrReplaceStub.resolves(true);
      expect(chai.request(this.app)
        .put(`/api/Lists/${this.listId}`)
        .send(this.list))
      .to.eventually.have.status(201)
      .notify(done);
    });
    it('to report replacing an existing list', done => {
      this.createOrReplaceStub.resolves(false);
      expect(chai.request(this.app)
        .put(`/api/Lists/${this.listId}`)
        .send(this.list))
      .to.eventually.have.status(204)
      .notify(done);
    });
    it('with invalid data to return validation errors', done => {
      expect(chai.request(this.app)
        .put(`/api/Lists/${this.listId}`)
        .send({}).then(() => {})
        .catch(err => err.response))
      .to.eventually.have.status(400)
      .and.to.eventually.be.json
      .and.to.eventually.have.deep.property('body.message', 'Validation errors') 
      .and.also.eventually.have.deep.property('body.errors[0].code', 'INVALID_REQUEST_PARAMETER') 
      .notify(done);
    });
    it('to attempt to save the list', () => {
      this.createOrReplaceStub.resolves(true);
      return chai.request(this.app)
        .put(`/api/Lists/${this.listId}`)
        .send(this.list)
        .then(() => {
          expect(this.createOrReplaceStub).to.have.been.calledOnce;
          expect(this.createOrReplaceStub.args[0][0])
            .and.to.be.an.instanceOf(model.List)
            .and.to.have.property('id', this.listId)
            .and.to.also.have.property('order', this.list.order)
            .and.to.also.have.property('name', this.list.name)
            .and.to.also.not.have.property('status');
        });
    });
    it('to forward exceptions', done => {
      const message = 'Nutella crepes';
      this.createOrReplaceStub.rejects(new Error(message));
      expect(chai.request(this.app)
        .put(`/api/Lists/${this.listId}`)
        .send(this.list).then(() => {})
        .catch(err => err.response))
      .to.eventually.have.status(500)
      .to.eventually.have.deep.property('body.message', message)
      .notify(done);
    });
  });

  describe('/{listId} PATCH', () => {
    beforeEach('setup list', () => {
      this.list = {
        status: 'dev'
      };
      this.listId = 456123;
    });
    it('to update the list', done => {
      this.updateStub.resolves(true);
      expect(chai.request(this.app)
        .patch(`/api/Lists/${this.listId}`)
        .send(this.list))
      .to.eventually.have.status(204)
      .notify(done);
    });
    it('to attempt to update the list', () => {
      this.updateStub.resolves(true);
      return chai.request(this.app)
        .patch(`/api/Lists/${this.listId}`)
        .send(this.list)
        .then(() => {
          expect(this.updateStub).to.have.been.calledOnce;
          expect(this.updateStub.args[0][0])
            .and.to.be.an.instanceOf(model.List)
            .and.to.have.property('id', this.listId)
            .and.to.also.have.property('status', this.list.status)
            .and.to.also.not.have.property('order')
            .and.to.also.not.have.property('name');
        });
    });
    it('to forward exceptions', done => {
      const message = 'Nutella crepes';
      this.updateStub.rejects(new Error(message));
      expect(chai.request(this.app)
        .patch(`/api/Lists/${this.listId}`)
        .send(this.list).then(() => {})
        .catch(err => err.response))
      .to.eventually.have.status(500)
      .to.eventually.have.deep.property('body.message', message)
      .notify(done);
    });
    it('to report when the list was not found', done => {
      this.updateStub.resolves(false);
      expect(chai.request(this.app)
        .patch(`/api/Lists/${this.listId}`)
        .send(this.list).then(() => {})
        .catch(err => err.response))
      .to.eventually.have.status(404)
      .notify(done);
    });
  });

  describe('/ GET', () => {
    it('to list the Lists', () => {
      const lists = tbd.from({})
        .prop('id').use(tbd.utils.range(1, 156123)).done()
        .make(4)
        .map(ch => new model.List(ch));
      this.listStub.resolves(lists);
      return chai.request(this.app).get('/api/Lists')
        .then(res => {
          expect(res).to.have.status(200);
          expect(lists.every(l => res.body.find(r => r.id === l.id)));
        });
    });
    it('to forward exceptions', done => {
      const message = 'Pecan Waffles';
      this.listStub.rejects(new Error(message));
      expect(chai.request(this.app)
        .get('/api/Lists').then(() => {})
        .catch(err => err.response))
      .to.eventually.have.status(500)
      .to.eventually.have.deep.property('body.message', message)
      .notify(done);
    });
  });
});
