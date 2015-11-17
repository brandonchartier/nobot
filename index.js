var clever = require("./modules/clever");
var config = require("./config");
var image = require("./modules/image");
var irc = require("irc");
var news = require("./modules/news");
var rap = require("./modules/rap");
var weather = require("./modules/weather");
var youtube = require("./modules/youtube");

var bot = new irc.Client(config.server, config.nick, {
  channels: config.channels,
  floodProtection: true,
  realName: config.nick
});

bot.addListener("message", function (nick, to, text) {
  // Don't bother replying to direct messages
  if (config.nick === to) return;

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
    default:
      clever(text, say);
  }

  function say(err, msg, toNick) {
    if (err) return console.error(err);
    bot.say(to, toNick ? nick + ": " + msg : msg);
  }
});

bot.addListener("error", function (message) {
  console.error(message);
});
