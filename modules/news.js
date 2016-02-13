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
		const req = request(feed);
		const parser = new FeedParser();

		req.on('error', err => {
			console.error(err);
		});

		req.on('response', res => {
			if (res.statusCode !== 200) {
				return req.emit('error', new Error('Bad status code'));
			}

			req.pipe(parser);
		});

		parser.on('error', err => {
			console.error(err);
		});

		parser.on('readable', () => {
			let item = parser.read();
			while (item) {
				cache.push(item);
				item = parser.read();
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
