irc = require "irc"
request = require "request"
config = require "./config"

bot = new irc.Client config.server, config.nick,
  channels: config.channels
  floodProtection: true
  realName: config.nick

sample = (xs) ->
  xs[Math.floor(Math.random() * xs.length)]

youtube = (query, callback) ->
  params =
    uri: "http://gdata.youtube.com/feeds/api/videos"
    json: true
    qs:
      "orderBy": "relevance"
      "max-results": 15
      "alt": "json"
      "q": query
  request params, (err, res, body) ->
    videos = (JSON.parse body).feed.entry
    callback "File not found" unless videos?
    (sample videos).link.forEach (link) ->
      if link.rel is "alternate" and link.type is "text/html"
        callback link.href

google = (query, callback) ->
  params =
    uri: "http://ajax.googleapis.com/ajax/services/search/images"
    json: true
    qs:
      "v": "1.0"
      "rsz": "8"
      "safe": "active"
      "q": query
  request params, (err, res, body) ->
    images = (JSON.parse body).responseData?.results
    callback (sample images).unescapedUrl if images?.length


bot.addListener "message", (nick, to, text, message) ->
  console.log nick, to, text, message

bot.addListener "error", (message) ->
  console.error message
