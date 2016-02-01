var _ = require("lodash");
var config = require("../config");
var request = require("request");

var regex = new RegExp("^" + config.nick + "[^\\s]*\\s+(?:rap|sing)\\s(?:about\\s)?(.+)", "i");

function makeRequest(query, done) {
  function trackSearchDone(err, res, body) {
    if (err) return done(err);

    var tracks = body.message.body.track_list;
    if (!tracks || !tracks.length) return done(null, "Rap not found", true);

    var lyricsParams = {
      uri: "http://api.musixmatch.com/ws/1.1/track.lyrics.get",
      json: true,
      qs: {
        "track_id": _.sample(tracks).track.track_id,
        "format": "json",
        "apikey": config.musix.key
      }
    };

    request(lyricsParams, getLyricsDone);
  }

  function getLyricsDone(err, res, body) {
    if (err) return done(err);

    var lyrics = body.message.body.lyrics;
    if (lyrics.restricted == 1) return done(null, "Nazty rap", true);

    var lines = lyrics.lyrics_body.split("\n");
    var joined = _.compact(lines).slice(0, 4).join(" / ");
    done(null, joined);
  }

  var trackParams = {
    uri: "http://api.musixmatch.com/ws/1.1/track.search",
    json: true,
    qs: {
      "q_lyrics": query,
      "page_size": 25,
      "f_has_lyrics": 1,
      "f_lyrics_language": "en",
      "format": "json",
      "apikey": config.musix.key
    }
  };

  request(trackParams, trackSearchDone);
}

function rap(text, done) {
  var capture = regex.exec(text);
  if (!capture) return false;

  makeRequest(capture[1], done);
  return true;
}

module.exports = rap;