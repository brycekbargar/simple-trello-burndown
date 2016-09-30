'use strict';

function Message(data) {
  if(data.yesterday) { this.yesterday = data.yesterday; } 
  if(data.yesterdayBacklogCount) { this.yesterdayBacklogCount = data.yesterdayBacklogCount; } 

  if(data.today) { this.today = data.today; } 
  if(data.todayBacklogCount) { this.todayBacklogCount = data.todayBacklogCount; } 
  if(data.todayInProgressCount) { this.todayInProgressCount = data.todayInProgressCount; } 
}

Message.sendDailyStatusUpdate = message =>
  Promise.resolve(message);

module.exports = Message;
