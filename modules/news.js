'use strict';

const _ = require('lodash');
const async = require('async');
const config = require('../config');
const FeedParser = require('feedparser');
const request = require('request');

let regex = new RegExp(`^${config.nick}[^\\s]*\\s+(?:news)$`, 'i');

let cache = [];

let refreshNews = () => {
  async.map(config.newsfeeds, (feed, done) => {
    request(feed).pipe(new FeedParser())
      .on('error', (err) => done(err))
      .on('readable', () => {
        let item = null;
        while (item = this.read()) done(null, item);
      });
  }, (err, results) => {
    if (err) return console.error(err);
    cache = results;
  })
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
