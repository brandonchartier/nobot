'use strict';

const _ = require('lodash');
const config = require('../config');
const FeedParser = require('feedparser');
const logger = require('../logger');
const request = require('request');

const regex = new RegExp(`^${config.nick}[^\\s]*\\s+(?:news)$`, 'i');

const refreshNews = () => {
	const cache = [];

	config.newsfeeds.forEach(feed => {
		const req = request(feed);
		const parser = new FeedParser();
		let count = 0;

		req.on('error', err => {
			logger.error('news', err);
		});

		req.on('response', res => {
			if (res.statusCode !== 200) {
				return req.emit('error', new Error('Bad status code'));
			}

			req.pipe(parser);
		});

		parser.on('error', err => {
			logger.error('news', err);
		});

		parser.on('readable', () => {
			let item = parser.read();
			while (item) {
				cache.push(item);
				item = parser.read();
				count++;
			}
		});

		parser.on('end', () => {
			logger.info(`${count} news items read from ${feed}`);
		});
	});

	return cache;
};

let cache = refreshNews();

setInterval(() => {
	cache = refreshNews();
}, 60 * 60 * 1000); // Every hour

const news = (text, done) => {
	if (!regex.test(text)) {
		return false;
	}

	if (!cache.length) {
		logger.warn('news cache empty');
		return done(null, 'News not found');
	}

	logger.regexMatch('news', text, regex);

	const item = _.sample(cache);
	done(null, `${item.title}\n${item.link}`);

	return true;
};

module.exports = news;
