var _ = require("lodash");
var config = require("../config");
var request = require("request");

var regex = new RegExp("^" + config.nick + "[^\\s]*\\s+(?:image|img)\\s(?:of\\s)?(.+)", "i");

function makeRequest(query, done) {
  var params = {
    uri: "http://ajax.googleapis.com/ajax/services/search/images",
    json: true,
    qs: {
      "v": "1.0",
      "rsz": "8",
      "safe": "active",
      "q": query
    }
  };

  request(params, function (err, res, body) {
    if (err) return done(err);

    if (body.responseData && body.responseData.results && body.responseData.results.length) {
      done(null, (_.sample(body.responseData.results)).unescapedUrl, true);
    } else {
      done(null, "File not found", true);
    }
  });
}

function image(text, done) {
  var capture = regex.exec(text);
  if (!capture) return false;

  makeRequest(capture[1], done);
  return true;
}

module.exports = image;