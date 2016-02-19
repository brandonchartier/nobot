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

logger.info(`connecting to ${config.server}, channels: ${config.channels}`);

const bot = new irc.Client(config.server, config.nick, {
	channels: config.channels,
	floodProtection: true,
	realName: config.nick
});

bot.addListener('registered', message => {
	logger.info(`connected to ${message.server}`);
});

bot.addListener('message', (nick, to, text) => {
	if (to === config.nick) {
		logger.debug(`ignoring pm: <${nick}> ${text}`);
		return;
	}

	const say = (err, msg, toNick) => {
		if (err) {
			return logger.error('module', err);
		}

		msg = toNick ? `${nick}: ${msg}` : msg;
		logger.saying(to, msg);

		bot.say(to, msg);
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
	logger.error('irc', message);
});

module.exports = bot;
