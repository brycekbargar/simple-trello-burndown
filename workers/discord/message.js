'use strict';

const config = require('./../../config/config.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const moment = require('moment');

function Message(data) {
  if(data.yesterday) { this.yesterday = data.yesterday; } 
  if(data.yesterdayBacklogCount) { this.yesterdayBacklogCount = data.yesterdayBacklogCount; } 

  if(data.today) { this.today = data.today; } 
  if(data.todayBacklogCount) { this.todayBacklogCount = data.todayBacklogCount; } 
  if(data.todayInProgressCount) { this.todayInProgressCount = data.todayInProgressCount; } 
}

Message.sendDailyStatusUpdate = message => {
  let messageText = ':zzz: :coffee: :sun_with_face:\n';
  if(message.today) {
    messageText += '```\n';
    const today = moment(message.today).calendar();
    const todayBacklog = message.todayBacklogCount;
    messageText += `When I checked ${today} I found ${todayBacklog} cards in the backlog.\n`;
    if(message.yesterday) {
      const yesterday = moment(message.yesterday).calendar();
      const delta = message.todayBacklogCount - message.yesterdayBacklogCount;
      messageText += `That is a ${delta} card change from ${yesterday}.\n`;
    }
    messageText += `\nWe are currently working on ${message.todayInProgressCount} cards.`;
    messageText += '\n```';
  } else {
    messageText += 'Sorry to bother you, but I appear to be having issues... Could someone check on me?';
  }

  return client.login(config.discord.token)
    .then(() => Promise.all(client.channels
      .filter(c => c instanceof Discord.TextChannel)
      .map(c => c.sendMessage(messageText))))
    .then(() => client.destroy());
};

module.exports = Message;
