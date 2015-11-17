var Cleverbot = require("cleverbot.io");
var config = require("../config");

var cleverbot = new Cleverbot(config.clever.user, config.clever.key);
cleverbot.setNick(config.nick);
cleverbot.create(function (err) {
  if (err) console.error(err);
});

var regex = new RegExp("^" + config.nick + "[^\\s]*\\s+(.+)", "i");

function makeRequest(query, done) {
  cleverbot.ask(query, function (err, response) {
    if (err) return done(err);
    done(null, response, true);
  });
}

function clever(text, done) {
  var capture = regex.exec(text);
  if (!capture) {
    return false;
  }

  makeRequest(capture[1], done);
  return true;
}

module.exports = clever;
