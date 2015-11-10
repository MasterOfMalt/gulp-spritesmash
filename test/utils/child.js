// Lovingly ripped off from https://github.com/twolfson/gulp.spritesmith/blob/master/test/utils/child.js
// Load in dependencies
var exec = require('child_process').exec;

// Define our execution helper
exports.run = function (cmd) {
  before(function runFn (done) {
    exec(cmd, function (err, stdout, stderr) {
      if (!err && stderr) {
        err = new Error(stderr);
      }
      done(err);
    });
  });
};