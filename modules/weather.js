var request = require("request");
var regex = new RegExp("^" + config.nick + "[^\\s]*\\s+(?:weather)$", "i");

function makeRequest(xs, done) {
  var ret = [];
  var len = xs.length;

  xs.forEach(function (x) {
    var params = {
      uri: "https://api.forecast.io/forecast/" + config.weather.key + "/" + x.coords,
      json: true
    };

    request(params, function (err, res, body) {
      len--;
      if (err) return done(err);

      if (body.currently) {
        ret.push(x.city + ": " + Math.round(body.currently.temperature) + "° " + body.currently.summary);
      } else {
        ret.push(x.city + " not found");
      }

      if (!len) done(null, ret.join("\n"));
    });
  });
}

function weather(text, done) {
  var test = regex.test(text);
  if (!test) {
    return false;
  }

  makeRequest(config.weather.cities, done);
  return true;
}

module.exports = weather;

