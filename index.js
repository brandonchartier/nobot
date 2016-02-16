'use strict';

const clever = require('./modules/clever');
const config = require('./config');
const date = require('./modules/date');
const image = require('./modules/image');
const irc = require('irc');
const logger = require('./logger');
const news = require('./modules/news');
const rap = require('./modules/rap');
const weather = require('./modules/weather');
const youtube = require('./modules/youtube');

logger.info(`Connecting to '${config.server}', channels: '${config.channels}'`);

const bot = new irc.Client(config.server, config.nick, {
	channels: config.channels,
	floodProtection: true,
	realName: config.nick
});

bot.addListener('registered', message => {
	logger.info(`Connected to '${message.server}'`);
});

bot.addListener('message', (nick, to, text) => {
	if (to === config.nick) {
		logger.debug(`Ignoring private message from '${nick}'`);
		return;
	}

	const say = (err, msg, toNick) => {
		if (err) {
			return logger.error('Module error:', err);
		}

		bot.say(to, toNick ? `${nick}: ${msg}` : msg);
	};

	switch (true) {
		case youtube(text, say):
			break;
		case image(text, say):
			break;
		case weather(text, say):
			break;
		case rap(text, say):
			break;
		case news(text, say):
			break;
		case date(text, say):
			break;
		default:
			clever(text, say);
	}
});

bot.addListener('error', message => {
	logger.error('IRC error:', message);
});

module.exports = bot;
