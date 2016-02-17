'use strict';

const _ = require('lodash');
const async = require('async');
const config = require('../config');
const logger = require('../logger');
const request = require('request');

const regex = new RegExp(`^${config.nick}[^\\s]*\\s+(?:weather)$`, 'i');

const iterator = (x, done) => {
	const params = {
		uri: `https://api.forecast.io/forecast/${config.weather.key}/${x.coords}`,
		json: true
	};

	request(params, (err, res, body) => {
		if (err) {
			return done(err);
		}

		if (body.currently) {
			done(null, `${x.city}: ${Math.round(body.currently.temperature)}° ${body.currently.summary}`);
		} else {
			logger.warn('city weather not found', x);
			done(null, `${x.city} not found`);
		}
	});
};

const makeRequest = (xs, done) => {
	async.map(xs, iterator, (err, results) => {
		if (err) {
			return done(err);
		}

		done(null, _.sortBy(results).join('\n'));
	});
};

const weather = (text, done) => {
	if (!regex.test(text)) {
		return false;
	}

	logger.regexMatch('weather', text, regex);
	makeRequest(config.weather.cities, done);

	return true;
};

module.exports = weather;
