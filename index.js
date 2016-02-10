'use strict';

const clever = require('./modules/clever');
const config = require('./config');
const date = require('./modules/date');
const image = require('./modules/image');
const irc = require('irc');
const news = require('./modules/news');
const rap = require('./modules/rap');
const weather = require('./modules/weather');
const youtube = require('./modules/youtube');

let bot = new irc.Client(config.server, config.nick, {
  channels: config.channels,
  floodProtection: true,
  realName: config.nick
});

bot.addListener('message', (nick, to, text) => {
  // Don't bother replying to direct messages
  if (to === config.nick) return;

  let say = (err, msg, toNick) => {
    if (err) return console.error(err);
    bot.say(to, toNick ? `${nick}: ${msg}` : msg);
  };

  switch (true) {
    case(youtube(text, say)):
      break;
    case(image(text, say)):
      break;
    case(weather(text, say)):
      break;
    case(rap(text, say)):
      break;
    case(news(text, say)):
      break;
    case(date(text, say)):
      break;
    default:
      clever(text, say);
  }
});

bot.addListener('error', message => console.error(message));
