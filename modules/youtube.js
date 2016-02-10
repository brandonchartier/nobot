'use strict';

const _ = require('lodash');
const config = require('../config');
const request = require('request');

let regex = new RegExp(`^${config.nick}[^\\s]*\\s+(?:video|youtube)\\s(?:of\\s)?(.+)`, 'i');

let makeRequest = (query, done) => {
  const params = {
    uri: 'https://www.googleapis.com/youtube/v3/search',
    json: true,
    qs: {
      'part': 'snippet',
      'order': 'viewCount',
      'type': 'video',
      'q': query,
      'key': config.google.key
    }
  };

  request(params, (err, res, body) => {
    if (err) return done(err);

    let videos = body.items;
    if (!videos) return done(null, 'Video not found', true);

    let video = _.sample(videos).id.videoId;
    done(null, `https://www.youtube.com/watch?v=${video}`, true);
  });
};

let youtube = (text, done) => {
  let capture = regex.exec(text);
  if (!capture) return false;

  makeRequest(capture[1], done);
  return true;
};

module.exports = youtube;
