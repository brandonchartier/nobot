'use strict';

const config = require('../config');
const exec = require('child_process').exec;
const logger = require('../logger');

const regex = new RegExp(`^${config.nick}[^\\s]*\\s+(?:ddate|date)$`, 'i');

const date = (text, done) => {
	if (!regex.test(text)) {
		return false;
	}

	logger.regexMatch('date', text, regex);

	exec('ddate', (err, stdout) => {
		if (err) {
			logger.error('date', err);
			return done(null, 'Date error', true);
		}

		done(null, stdout, true);
	});

	return true;
};

module.exports = date;
