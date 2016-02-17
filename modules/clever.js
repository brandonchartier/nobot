'use strict';

const Cleverbot = require('cleverbot.io');
const config = require('../config');
const logger = require('../logger');

const cleverbot = new Cleverbot(config.clever.user, config.clever.key);

cleverbot.setNick(config.nick);
cleverbot.create(err => {
	if (err) {
		logger.error('clever', err);
	}
});

const regex = new RegExp(`^${config.nick}[^\\s]*\\s+(.+)`, 'i');

const makeRequest = (query, done) => {
	cleverbot.ask(query, (err, res) => {
		if (err) {
			return done(err);
		}

		done(null, res, true);
	});
};

const clever = (text, done) => {
	const capture = regex.exec(text);

	if (!capture) {
		return false;
	}

	logger.regexMatch('clever', text, regex, capture);
	makeRequest(capture[1], done);

	return true;
};

module.exports = clever;
