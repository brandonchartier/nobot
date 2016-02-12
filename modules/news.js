'use strict';

const _ = require('lodash');
const config = require('../config');
const FeedParser = require('feedparser');
const request = require('request');

const regex = new RegExp(`^${config.nick}[^\\s]*\\s+(?:news)$`, 'i');

let cache = [];

const refreshNews = () => {
	cache = [];

	config.newsfeeds.forEach(feed => {
		request(feed)
			.pipe(new FeedParser())
			.on('error', err => {
				console.error(err);
			})
			.on('readable', function () {
				let item = null;
				while (item = this.read()) {
					cache.push(item);
				}
			});
	});
};

refreshNews();
setInterval(refreshNews, 60 * 60 * 1000); // Every hour

const news = (text, done) => {
	if (!regex.test(text)) {
		return false;
	}

	if (!cache.length) {
		return done(null, 'News not found');
	}

	const item = _.sample(cache);
	done(null, `${item.title}\n${item.link}`);

	return true;
};

module.exports = news;
