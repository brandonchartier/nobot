'use strict';

const _ = require('lodash');
const config = require('../config');
const fs = require('fs');
const logger = require('../logger');

const regex = new RegExp(`^${config.nick}[^\\s]*\\s+(?:three|three words)$`, 'i');

const threeWords = (text, done) => {
	if (!regex.test(text)) {
		return false;
	}

	fs.readFile('/usr/share/dict/words', 'utf8', (err, data) => {
		if (err) {
			logger.error('three', err);
			return done(null, 'Three error', true);
		}

		const words = data.split('\n').filter(word => {
			return !word.includes('\'');
		});

		const [one, two, three, ...rest] = _.shuffle(words);

		done(null, `${one} ${two} ${three}`, true);
	});

	return true;
};

module.exports = threeWords;
