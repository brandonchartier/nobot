'use strict';

const _ = require('lodash');
const async = require('async');
const config = require('../config');
const request = require('request');

let regex = new RegExp(`^${config.nick}[^\\s]*\\s+(?:weather)$`, 'i');

let iterator = (x, done) => {
  const params = {
    uri: `https://api.forecast.io/forecast/${config.weather.key}/${x.coords}`,
    json: true
  };

  request(params, (err, res, body) => {
    if (err) return done(err);

    if (body.currently) {
      done(null, `${x.city}: ${Math.round(body.currently.temperature)}° ${body.currently.summary}`);
    } else {
      done(null, `${x.city} not found`);
    }
  });
};

let makeRequest = (xs, done) => {
  async.map(xs, iterator, (err, results) => {
    if (err) return done(err);
    done(null, results);
  });
};

let weather = (text, done) => {
  if (!regex.test(text)) return false;

  makeRequest(config.weather.cities, done);
  return true;
};

module.exports = weather;
