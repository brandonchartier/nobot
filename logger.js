'use strict';

// If testing, save to test.log, don't log to console

const config = require('./config');
const winston = require('winston');

const logger = new winston.Logger({
	level: config.logging.level,
	transports: [
		new (winston.transports.Console)({timestamp: true, prettyPrint: true}),
		new (winston.transports.File)({filename: 'nobot.log', json: false, prettyPrint: true})
	]
});

logger.regexMatch = (mod, text, regex, capture) => {
	let msg = `${mod}: '${text}' matches '${regex}'`;
	if (capture) {
		msg += `, captured '${capture[1]}'`;
	}

	logger.debug(msg);
};

logger.cli();

module.exports = logger;
