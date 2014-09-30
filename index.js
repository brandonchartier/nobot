var Cleverbot = require("cleverbot-node");
var irc = require("irc");
var request = require("request");
var config = require("./config");

var cleverbot = new Cleverbot();

var bot = new irc.Client(config.server, config.nick, {
  channels: config.channels,
  floodProtection: true,
  realName: config.nick
});

var sample = function(xs) {
  return xs[Math.floor(Math.random() * xs.length)];
};

var youtube = function(query, done) {
  var params = {
    uri: "http://gdata.youtube.com/feeds/api/videos",
    json: true,
    qs: {
      "orderBy": "relevance",
      "max-results": 15,
      "alt": "json",
      "q": query
    }
  };
  request(params, function(err, res, body) {
    if (err) return done(err);
    var videos = body.feed.entry;
    if (!videos) {
      return done(null, "File not found");
    }
    (sample(videos)).link.forEach(function(link) {
      if (link.rel === "alternate" && link.type === "text/html") {
        done(null, link.href);
      }
    });
  });
};

var image = function(query, done) {
  var params = {
    uri: "http://ajax.googleapis.com/ajax/services/search/images",
    json: true,
    qs: {
      "v": "1.0",
      "rsz": "8",
      "safe": "active",
      "q": query
    }
  };
  request(params, function(err, res, body) {
    if (err) return done(err);
    if (body.responseData && body.responseData.results && body.responseData.results.length) {
      done(null, (sample(body.responseData.results)).unescapedUrl);
    } else {
      done(null, "File not found");
    }
  });
};

var clever = function(query, done) {
  cleverbot.write(query, function(clvr) {
    done(clvr.message);
  });
};

var re = {
  nick: new RegExp(config.nick + ".?\\s+(.*)"),
  youtube: /(?:video|youtube)\s(?:of\s)?(.*)/i,
  image: /(?:image|img)\s(?:of\s)?(.*)/i
};

bot.addListener("message", function(nick, to, text, message) {
  if (config.nick === to) return;
  if (!re.nick.test(text)) return;
  if (re.youtube.test(text)) {
    youtube((re.youtube.exec(text))[1], function(err, msg) {
      if (err) return console.error(err);
      bot.say(to, nick + ": " + msg);
    });
  } else if (re.image.test(text)) {
    image((re.image.exec(text))[1], function(err, msg) {
      if (err) return console.error(err);
      bot.say(to, nick + ": " + msg);
    });
  } else {
    clever((re.nick.exec(text))[1], function(msg) {
      bot.say(to, nick + ": " + msg);
    });
  }
});

bot.addListener("error", function(message) {
  console.error(message);
});
