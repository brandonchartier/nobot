'use strict';

const config = require('./config');
const winston = require('winston');

let logger;

if (process.env.NODE_ENV === 'test') {
	logger = new winston.Logger({
		level: 'debug',
		transports: [
			new (winston.transports.File)({filename: '../test.log', json: false, prettyPrint: true})
		]
	});
} else {
	logger = new winston.Logger({
		level: config.logging.level,
		transports: [
			new (winston.transports.Console)({timestamp: true, prettyPrint: true}),
			new (winston.transports.File)({filename: 'nobot.log', json: false, prettyPrint: true})
		]
	});
}

logger.saying = (to, msg) => {
	for (const line of msg.split('\n')) {
		logger.debug(`saying: [${to}] ${line}`);
	}
};

logger.regexMatch = (mod, text, regex, capture) => {
	let msg = `${mod}: '${text}' matches '${regex}'`;
	if (capture) {
		msg += `, captured '${capture[1]}'`;
	}

	logger.debug(msg);
};

logger.cli();

module.exports = logger;
