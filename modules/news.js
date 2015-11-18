var _ = require("lodash");
var config = require("../config");
var FeedParser = require("feedparser");
var request = require("request");

var regex = new RegExp("^" + config.nick + "[^\\s]*\\s+(?:news)$", "i");
var items = [];

function refreshNews() {
  items = [];

  config.newsfeeds.forEach(function (feed) {
    request(feed)
      .pipe(new FeedParser())
      .on('error', function (err) {
        console.error(err);
      })
      .on('readable', function () {
        var item;
        while (item = this.read()) {
          items.push(item);
        }
      });
  });
}

refreshNews();
setInterval(refreshNews, 60 * 60 * 1000); //Every hour

function news(text, done) {
  var test = regex.test(text);
  if (!test) return false;
  if (items.length === 0) return done(null, "News not found");

  var item = _.sample(items);
  done(null, item.title + "\n" + item.link);
  return true;
}

module.exports = news;