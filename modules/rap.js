'use strict';

const _ = require('lodash');
const async = require('async');
const config = require('../config');
const request = require('request');

const regex = new RegExp(`^${config.nick}[^\\s]*\\s+(?:rap|sing)\\s(?:about\\s)?(.+)`, 'i');

const search = done => {
	const params = {
		uri: 'http://api.musixmatch.com/ws/1.1/track.search',
		json: true,
		qs: {
			q_lyrics: this.query,
			page_size: 25,
			f_has_lyrics: 1,
			f_lyrics_language: 'en',
			format: 'json',
			apikey: config.musix.key
		}
	};

	request(params, (err, res, body) => {
		if (err) {
			return done(err);
		}

		const tracks = body.message.body.track_list;
		if (!tracks || !tracks.length) {
			return done('Rap not found');
		}

		done(null, tracks);
	});
};

const lyrics = (tracks, done) => {
	const params = {
		uri: 'http://api.musixmatch.com/ws/1.1/track.lyrics.get',
		json: true,
		qs: {
			track_id: _.sample(tracks).track.track_id,
			format: 'json',
			apikey: config.musix.key
		}
	};

	request(params, (err, res, body) => {
		if (err) {
			return done(err);
		}

		const lyrics = body.message.body.lyrics;
		if (lyrics.restricted === 1) {
			return done('Nazty rap');
		}

		const lines = lyrics.lyrics_body.split('\n');
		const joined = _.compact(lines).slice(0, 4).join(' / ');

		done(null, joined);
	});
};

const makeRequest = (query, done) => {
	this.query = query;

	async.waterfall([
		search.bind(this),
		lyrics
	], (err, res) => {
		if (err) {
			done(null, err, true);
		}

		done(null, res);
	});
};

const rap = (text, done) => {
	const capture = regex.exec(text);
	if (!capture) {
		return false;
	}

	makeRequest(capture[1], done);
	return true;
};

module.exports = rap;
