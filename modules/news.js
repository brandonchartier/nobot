var _ = require("lodash");
var config = require("../config");
var FeedParser = require("feedparser");
var request = require("request");

var regex = new RegExp("^" + config.nick + "[^\\s]*\\s+(?:news)$", "i");

function makeRequest(done) {
  var feed = _.sample(config.newsfeeds);
  var items = [];

  request(feed)
    .pipe(new FeedParser())
    .on('error', function () {
      done(null, "News not found");
    })
    .on('readable', function () {
      var item;
      while (item = this.read()) {
        items.push(item);
      }
    })
    .on('end', function () {
      var item = _.sample(items);
      done(null, item.title + "\n" + item.link);
    });
}

function news(text, done) {
  var test = regex.test(text);
  if (!test) {
    return false;
  }

  makeRequest(done);
  return true;
}

module.exports = news;