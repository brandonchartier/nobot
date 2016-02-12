'use strict';

const config = require('../config');
const exec = require('child_process').exec;

const regex = new RegExp(`^${config.nick}[^\\s]*\\s+(?:ddate|date)$`, 'i');

const date = (text, done) => {
	if (!regex.test(text)) {
		return false;
	}

	exec('ddate', (err, stdout) => {
		if (err) {
			return done(null, 'Date error', true);
		}
		done(null, stdout, true);
	});

	return true;
};

module.exports = date;
