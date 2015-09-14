var Cleverbot = require("cleverbot.io");
var irc = require("irc");
var rapgenius = require("rapgenius-js");
var request = require("request");
var config = require("./config");

var cleverbot = new Cleverbot(config.clever.user, config.clever.key);
cleverbot.setNick(config.nick);

cleverbot.create(function(err, session) {
  if (err) console.error(err);
});

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
    uri: "https://www.googleapis.com/youtube/v3/search",
    json: true,
    qs: {
      "part": "snippet",
      "order": "viewCount",
      "type": "video",
      "q": query,
      "key": config.youtube.key
    }
  };

  request(params, function(err, res, body) {
    if (err) return done(err);
    var videos = body.items;

    if (!videos) {
      return done(null, "Video not found");
    }

    var video = sample(videos).id.videoId;
    done(null, "https://www.youtube.com/watch?v=" + video);
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

var weather = function(xs, done) {
  var ret = [];
  var len = xs.length;

  xs.forEach(function(x) {
    var params = {
      uri: "https://api.forecast.io/forecast/" + config.weather.key + "/" + x.coords,
      json: true
    };

    request(params, function(err, res, body) {
      len--;
      if (err) return done(err);

      if (body.currently) {
        ret.push(x.city + ": " + Math.round(body.currently.temperature) + "° " + body.currently.summary);
      } else {
        ret.push(x.city + " not found");
      }

      if (!len) done(null, ret);
    });
  });
};

var rap = function(query, done) {
  var lyricsSearchDone = function(err, lyricsAndExplanations) {
    if (err) return done(err);

    var lyrics = lyricsAndExplanations.lyrics;
    var lines = lyrics.getFullLyrics(false).split("\n");
    lines = lines.filter(function(l) { return l });
    done(null, lines.slice(0, 3).join(" / "));
  };

  var songSearchDone = function(err, songs) {
    if (err) return done(err);
    if (songs.length === 0) return done("Rap not found");

    rapgenius.searchLyricsAndExplanations(sample(songs).link, "rap", lyricsSearchDone);
  };

  rapgenius.searchSong(query, "rap", songSearchDone);
};

var clever = function(query, done) {
  cleverbot.ask(query, function(err, response) {
    if (err) return done(err);
    done(null, response);
  });
};

var re = {
  nick: new RegExp(config.nick + "[^\\s]*\\s+(.+)", "i"),
  youtube: /(?:video|youtube)\s(?:of\s)?(.+)/i,
  image: /(?:image|img)\s(?:of\s)?(.+)/i,
  weather: /(?:weather)/i,
  rap: /(?:rap)\s(?:about\s)?(.+)/i
};

bot.addListener("message", function(nick, to, text, message) {
  // Don't bother replying to direct messages
  if (config.nick === to) return;

  // Don't bother replying to messages that are not directed at me
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
  } else if (re.weather.test(text)) {
    weather(config.weather.cities, function(err, cities) {
      if (err) return console.error(err);
      cities.forEach(function(city) {
        bot.say(to, city);
      });
    });
  } else if (re.rap.test(text)) {
    rap(re.rap.exec(text)[1], function (err, msg) {
      if (err) return console.error(err);
      bot.say(to, msg);
    });
  } else {
    clever(re.nick.exec(text)[1], function(err, msg) {
      if (err) return console.error(err);
      bot.say(to, nick + ": " + msg);
    });
  }
});

bot.addListener("error", function(message) {
  console.error(message);
});
