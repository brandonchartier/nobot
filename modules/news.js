'use strict';

const _ = require('lodash');
const async = require('async');
const config = require('../config');
const FeedParser = require('feedparser');
const request = require('request');

let regex = new RegExp(`^${config.nick}[^\\s]*\\s+(?:news)$`, 'i');

let cache = [];

let refreshNews = () => {
  cache = [];

  config.newsfeeds.forEach(function (feed) {
    request(feed)
      .pipe(new FeedParser())
      .on('error', function (err) {
        console.error(err);
      })
      .on('readable', function () {
        let item;
        while (item = this.read()) {
          cache.push(item);
        }
      });
  });
};

refreshNews();
setInterval(refreshNews, 60 * 60 * 1000); //Every hour

let news = (text, done) => {
  if (!regex.test(text)) return false;

  if (!cache.length) return done(null, 'News not found');

  let item = _.sample(cache);
  done(null, `${item.title}\n${item.link}`);

  return true;
};

module.exports = news;
