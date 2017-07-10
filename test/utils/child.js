"use strict";
/* global before, describe, it*/

// Lovingly ripped off from https://github.com/twolfson/gulp.spritesmith/blob/master/test/utils/child.js
// Load in dependencies
const exec = require("child_process").exec;

// Define our execution helper
exports.run = function(cmd) {
  before(function runFn(done) {
    exec(cmd, function(err, stdout, stderr) {
      let newErr = err;
      if (!newErr && stderr) {
        newErr = new Error(stderr);
      }

      done(newErr);
    });
  });
};
