var _ = require("lodash");
var config = require("../config");
var request = require("request");

var regex = new RegExp("^" + config.nick + "[^\\s]*\\s+(?:video|youtube)\\s(?:of\\s)?(.+)", "i");

function makeRequest(query, done) {
  var params = {
    uri: "https://www.googleapis.com/youtube/v3/search",
    json: true,
    qs: {
      "part": "snippet",
      "order": "viewCount",
      "type": "video",
      "q": query,
      "key": config.youtube.key
    }
  };

  request(params, function (err, res, body) {
    if (err) return done(err);
    var videos = body.items;

    if (!videos) {
      return done(null, "Video not found", true);
    }

    var video = _.sample(videos).id.videoId;
    done(null, "https://www.youtube.com/watch?v=" + video, true);
  });
}

function youtube(text, done) {
  var capture = regex.exec(text);
  if (!capture) {
    return false;
  }

  makeRequest(capture[1], done);
  return true;
}

module.exports = youtube;
