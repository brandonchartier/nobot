var _ = require("lodash");
var cheerio = require('cheerio');
var config = require("../config");
var langDetect = new (require('languagedetect'));
var request = require("request");

var regex = new RegExp("^" + config.nick + "[^\\s]*\\s+(?:quote)\\s?(.+)", "i");

function makeRequest(nick, done, attempt) {
  attempt = attempt || 0;
  attempt++;

  request(config.quote_url, function (err, res, body) {
    if (err) return done(err);

    var $ = cheerio.load(body);
    var comment = $("#comment").find("a > span").text();

    var lang = langDetect.detect(comment, 1);
    if(lang.length && lang[0][0] === "english" && comment.length < 420) {
      var time = _.padLeft(_.random(0, 23), 2, 0) + ":" + _.padLeft(_.random(0, 59), 2, 0);
      done(null, "[" + time + "] " + "<@" + nick + "> " + comment, true);
    } else if (attempt < 8) {
      makeRequest(nick, done, attempt);
    } else {
      done(null, "Quote not found", true);
    }
  });
}

function quote(text, done) {
  var capture = regex.exec(text);
  if (!capture) return false;

  makeRequest(_.trimRight(capture[1]), done);
  return true;
}

module.exports = quote;