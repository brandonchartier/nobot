var request = require("request");
var FeedParser = require("feedparser");

var regex = new RegExp("^" + config.nick + "[^\\s]*\\s+(?:news)$", "i");

function makeRequest(done) {
  var feed = sample(config.newsfeeds);
  var items = [];

  request(feed)
    .pipe(new FeedParser())
    .on('error', function () {
      done(null, "Unable to parse news");
    })
    .on('readable', function () {
      var item;
      while (item = this.read()) {
        items.push(item);
      }
    })
    .on('end', function () {
      var item = sample(items);
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