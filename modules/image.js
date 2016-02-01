var _ = require("lodash");
var config = require("../config");
var request = require("request");

var regex = new RegExp("^" + config.nick + "[^\\s]*\\s+(?:image|img)\\s(?:of\\s)?(.+)", "i");

function makeRequest(query, done) {
  var params = {
    uri: "https://www.googleapis.com/customsearch/v1",
    json: true,
    qs: {
      "q": query,
      "cx": config.google.cx,
      "searchType": "image",
      "key": config.google.key
    }
  };

  request(params, function (err, res, body) {
    if (err) return done(err);

    if (body && body.items && body.items.length) {
      done(null, (_.sample(body.items)).link, true);
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