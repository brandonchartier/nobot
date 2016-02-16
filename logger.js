'use strict';

const config = require('./config');
const winston = require('winston');

const logger = new winston.Logger({
	level: config.logging.level,
	transports: [
		new (winston.transports.Console)({timestamp: true}),
		new (winston.transports.File)({filename: 'nobot.log', json: false})
	]
});

logger.cli();

module.exports = logger;
