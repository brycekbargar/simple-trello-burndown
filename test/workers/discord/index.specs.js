'use strict';

const sinon = require('sinon');
const stub = sinon.stub;
require('sinon-as-promised');
const tbd = require('tbd');
const expect = require('./../../chai.js').expect;
const moment = require('moment');

const discord = require('./../../../workers/discord/index.js');
const CardHistory = require('./../../../workers/model/cardHistory.js');
const Message = require('./../../../workers/model/message.js');

describe('[Discord] Expect discord bot', () => {
  beforeEach('setup spies', () => {
    this.getRecentHistoryStub = stub(CardHistory, 'getRecentHistory');
    this.sendDailyStatusUpdateStub = stub(Message, 'sendDailyStatusUpdate');
  });
  afterEach('teardown spies', () => {
    this.getRecentHistoryStub.restore();
    this.getRecentHistoryStub.resetBehavior();
    this.sendDailyStatusUpdateStub.restore();
    this.sendDailyStatusUpdateStub.resetBehavior();
  });

  it('to run', done => {
    const client = {};
    this.getRecentHistoryStub.resolves([]);
    discord(client)
    .then(() => {
      expect(this.getRecentHistoryStub).to.have.been.calledOnce
      .and.to.have.been.calledWith(client);
      expect(this.sendDailyStatusUpdateStub).to.have.been.calledOnce
      .and.to.have.been.calledWithMatch(sinon.match.instanceOf(Message));
      done();
    })
    .catch(done);
  });

  describe('to use', () => {
    it('the only day', done => {
      const backlogCount = 5;
      const inProgressCount = 6;
      const today = moment().format();
      const cardHistories = tbd.from({
        createdAt: today,
        status: 'backlog'
      })
      .make(backlogCount)
      .concat(tbd.from({
        createdAt: today
      })
      .prop('status').use(tbd.utils.random(
        'qa',
        'dev'
      )).done()
      .make(inProgressCount))
      .concat(tbd.from({
        createdAt: today,
        status: 'done'
      })
      .make(3))
      .map(ch => new CardHistory(ch));
      this.getRecentHistoryStub.resolves(cardHistories); 

      discord({})
      .then(() => {
        expect(this.sendDailyStatusUpdateStub).to.have.been.calledWith({
          today: today,
          todayBacklogCount: backlogCount,
          todayInProgressCount: inProgressCount
        });
        done();
      })
      .catch(done);
    });

    it('both days', done => {
      const today = moment().format();
      const todayBacklogCount = 12;
      const inProgressCount = 6;
      const yesterday = moment().add(-1, 'days').startOf('day').format();
      const yesterdayBacklogCount = 5;
      const cardHistories = tbd.from({
        createdAt: today,
        status: 'backlog'
      })
      .make(todayBacklogCount)
      .concat(tbd.from({
        createdAt: today
      })
      .prop('status').use(tbd.utils.random(
        'qa',
        'dev'
      )).done()
      .make(inProgressCount))
      .concat(tbd.from({
        createdAt: yesterday,
        status: 'backlog'
      })
      .make(yesterdayBacklogCount))
      .concat(tbd.from({
        createdAt: today,
        status: 'done'
      })
      .make(3))
      .concat(tbd.from({
        createdAt: yesterday,
      })
      .prop('status').use(tbd.utils.random(
        'qa',
        'dev',
        'done'
      ))
      .make(7))
      .map(ch => new CardHistory(ch));
      this.getRecentHistoryStub.resolves(cardHistories); 

      discord({})
      .then(() => {
        const message ={
          yesterday: yesterday,
          yesterdayBacklogCount: yesterdayBacklogCount,
          today: today,
          todayBacklogCount: todayBacklogCount,
          todayInProgressCount: inProgressCount
        };
        expect(this.sendDailyStatusUpdateStub).to.have.been.calledWith(message);
        done();
      })
      .catch(done);
    });

    it('the last two when there are more than two days', done => {
      const today = moment().format();
      const todayBacklogCount = 12;
      const inProgressCount = 6;
      const yesterday = moment().add(-1, 'days').startOf('day').format();
      const yesterdayBacklogCount = 5;
      const cardHistories = tbd.from({
        createdAt: today,
        status: 'backlog'
      })
      .make(todayBacklogCount)
      .concat(tbd.from({
        createdAt: today
      })
      .prop('status').use(tbd.utils.random(
        'qa',
        'dev'
      )).done()
      .make(inProgressCount))
      .concat(tbd.from({
        createdAt: yesterday,
        status: 'backlog'
      })
      .make(yesterdayBacklogCount))
      .concat(tbd.from({
        createdAt: today,
        status: 'done'
      })
      .make(3))
      .concat(tbd.from({
        createdAt: yesterday,
      })
      .prop('status').use(tbd.utils.random(
        'qa',
        'dev',
        'done'
      ))
      .make(7))
      .concat(tbd.from({})
      .prop('status').use(tbd.utils.random(
        'qa',
        'dev',
        'done',
        'backlog'
      )).done()
      .prop('createdAt').use(tbd.utils.random(
        moment().add(-6, 'days').format(),
        moment().add(-5, 'days').format(),
        moment().add(-8, 'days').format()
      )).done()
      .make(8))
      .map(ch => new CardHistory(ch));
      this.getRecentHistoryStub.resolves(cardHistories); 

      discord({})
      .then(() => {
        const message ={
          yesterday: yesterday,
          yesterdayBacklogCount: yesterdayBacklogCount,
          today: today,
          todayBacklogCount: todayBacklogCount,
          todayInProgressCount: inProgressCount
        };
        expect(this.sendDailyStatusUpdateStub).to.have.been.calledWith(message);
        done();
      })
      .catch(done);
    });

    it('the latest records for each day', done => {
      const today = moment().add(-1, 'days').startOf('day').add(16, 'hours').format();
      const todayBacklogCount = 12;
      const inProgressCount = 6;
      const yesterday = moment().add(-2, 'days').startOf('day').add(13, 'hours').format();
      const yesterdayBacklogCount = 5;
      const cardHistories = tbd.from({
        createdAt: today,
        status: 'backlog'
      })
      .make(todayBacklogCount)
      .concat(tbd.from({
        createdAt: today
      })
      .prop('status').use(tbd.utils.random(
        'qa',
        'dev'
      )).done()
      .make(inProgressCount))
      .concat(tbd.from({
        createdAt: yesterday,
        status: 'backlog'
      })
      .make(yesterdayBacklogCount))
      .concat(tbd.from({
        createdAt: today,
        status: 'done'
      })
      .make(3))
      .concat(tbd.from({
        createdAt: yesterday,
      })
      .prop('status').use(tbd.utils.random(
        'qa',
        'dev',
        'done'
      ))
      .make(7))
      .concat(tbd.from({})
      .prop('status').use(tbd.utils.random(
        'qa',
        'dev',
        'done',
        'backlog'
      )).done()
      .prop('createdAt').use(tbd.utils.random(
        moment(today).add(-6, 'hours').format(),
        moment(today).add(-12, 'hours').format(),
        moment(today).add(-3, 'hours').format(),
        moment(yesterday).add(-12, 'hours').format(),
        moment(yesterday).add(-4, 'hours').format()
      )).done()
      .make(9))
      .map(ch => new CardHistory(ch));
      this.getRecentHistoryStub.resolves(cardHistories); 

      discord({})
      .then(() => {
        const message ={
          yesterday: yesterday,
          yesterdayBacklogCount: yesterdayBacklogCount,
          today: today,
          todayBacklogCount: todayBacklogCount,
          todayInProgressCount: inProgressCount
        };
        expect(this.sendDailyStatusUpdateStub).to.have.been.calledWith(message);
        done();
      })
      .catch(done);
    });

  });
});
