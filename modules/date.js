var config = require("../config");
var exec = require("child_process").exec;

var regex = new RegExp("^" + config.nick + "[^\\s]*\\s+(?:ddate|date)$", "i");

function date(text, done) {
  var test = regex.test(text);
  if (!test) return false;

  exec("ddate", function (err, stdout) {
    if (err) return done(null, "Date error", true);
    done(null, stdout, true);
  });
  return true;
}

module.exports = date;

