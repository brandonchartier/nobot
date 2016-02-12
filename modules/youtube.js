'use strict';

const _ = require('lodash');
const config = require('../config');
const request = require('request');

const regex = new RegExp(`^${config.nick}[^\\s]*\\s+(?:video|youtube)\\s(?:of\\s)?(.+)`, 'i');

const makeRequest = (query, done) => {
	const params = {
		uri: 'https://www.googleapis.com/youtube/v3/search',
		json: true,
		qs: {
			part: 'snippet',
			order: 'viewCount',
			type: 'video',
			q: query,
			key: config.google.key
		}
	};

	request(params, (err, res, body) => {
		if (err) {
			return done(err);
		}

		const videos = body.items;
		if (!videos) {
			return done(null, 'Video not found', true);
		}

		const video = _.sample(videos).id.videoId;
		done(null, `https://www.youtube.com/watch?v=${video}`, true);
	});
};

const youtube = (text, done) => {
	const capture = regex.exec(text);
	if (!capture) {
		return false;
	}

	makeRequest(capture[1], done);
	return true;
};

module.exports = youtube;
