const Cleverbot = require('cleverbot.io');
const config = require('../config');

let cleverbot = new Cleverbot(config.clever.user, config.clever.key);

cleverbot.setNick(config.nick);
cleverbot.create(err => if (err) console.error(err));

let regex = new RegExp(`^${config.nick}[^\\s]*\\s+(.+)`, 'i');

let makeRequest = (query, done) => {
  cleverbot.ask(query, (err, res) => {
    if (err) return done(err);
    done(null, res, true);
  })
};

let clever = (text, done) => {
  let capture = regex.exec(text);

  if (!capture) return false;

  makeRequest(capture[1], done);
  return true;
};

module.exports = clever;
