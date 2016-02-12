'use strict';

const _ = require('lodash');
const async = require('async');
const config = require('../config');
const request = require('request');

var regex = new RegExp(`^${config.nick}[^\\s]*\\s+(?:rap|sing)\\s(?:about\\s)?(.+)`, 'i');

let search = (done) => {
  const params = {
    uri: 'http://api.musixmatch.com/ws/1.1/track.search',
    json: true,
    qs: {
      'q_lyrics': this.query,
      'page_size': 25,
      'f_has_lyrics': 1,
      'f_lyrics_language': 'en',
      'format': 'json',
      'apikey': config.musix.key
    }
  };

  request(params, (err, res, body) => {
    if (err) return done(err);

    let tracks = body.message.body.track_list;
    if (!tracks || !tracks.length) return done('Rap not found');

    done(null, tracks);
  });
};

let lyrics = (tracks, done) => {
  const params = {
    uri: 'http://api.musixmatch.com/ws/1.1/track.lyrics.get',
    json: true,
    qs: {
      'track_id': _.sample(tracks).track.track_id,
      'format': 'json',
      'apikey': config.musix.key
    }
  };

  request(params, (err, res, body) => {
    if (err) return done(err);

    let lyrics = body.message.body.lyrics;
    if (lyrics.restricted === 1) return done('Nazty rap');

    let lines = lyrics.lyrics_body.split('\n');
    let joined = _.compact(lines).slice(0, 4).join(' / ');

    done(null, joined);
  });
};

let makeRequest = (query, done) => {
  this.query = query;

  async.waterfall([
    search.bind(this),
    lyrics
  ], (err, res) => {
    if (err) done(null, err, true);
    done(null, res);
  });
};

let rap = (text, done) => {
  let capture = regex.exec(text);
  if (!capture) return false;

  makeRequest(capture[1], done);
  return true;
};

module.exports = rap;
