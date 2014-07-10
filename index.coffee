irc = require "irc"
request = require "request"
config = require "./config"

bot = new irc.Client config.server, config.nick,
  channels: config.channels
  floodProtection: true
  realName: config.nick

sample = (xs) ->
  xs[Math.floor(Math.random() * xs.length)]

youtube = (query, done) ->
  params =
    uri: "http://gdata.youtube.com/feeds/api/videos"
    json: true
    qs:
      "orderBy": "relevance"
      "max-results": 15
      "alt": "json"
      "q": query
  request params, (err, res, body) ->
    done err if err
    videos = (JSON.parse body).feed.entry
    done null, "File not found" unless videos?
    (sample videos).link.forEach (link) ->
      if link.rel is "alternate" and link.type is "text/html"
        done null, link.href

image = (query, done) ->
  params =
    uri: "http://ajax.googleapis.com/ajax/services/search/images"
    json: true
    qs:
      "v": "1.0"
      "rsz": "8"
      "safe": "active"
      "q": query
  request params, (err, res, body) ->
    done err if err
    images = (JSON.parse body).responseData?.results
    done null, (sample images).unescapedUrl if images?.length

re:
  nick: new RegExp "#{config.nick}.?\\s+(.*)"
  youtube: /(?:video|youtube)\s(?:of\s)?(.*)/i
  image: /image\s(?:of\s)?(.*)/i

bot.addListener "message", (nick, to, text, message) ->
  return if config.nick is to
  if re.nick.test text
    if re.youtube.test text
      youtube (re.youtube.exec text)[1], (err, msg) ->
        console.error err if err
        bot.say to, msg
    else if re.image.test text
      image (re.image.exec text)[1], (err, msg) ->
        console.error err if err
        bot.say to, msg

bot.addListener "error", (message) ->
  console.error message
