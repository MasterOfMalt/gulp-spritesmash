"use strict";

const through2 = require("through2");
const crypto = require("crypto");
const _ = require("lodash");
const path = require("path");
const gutil = require("gulp-util");

function spriteSmash(options) {
  const renames = [];

  const opts = options || {};
  opts.updateFormats = opts.updateFormats || [];
  opts.revisionFormats = opts.revisionFormats || [];
  opts.hashFunction = opts.hashFunction || "MD5";

  const revisionFormats = ["png", "jpeg", "jpg", "svg", "gif"].concat(
    opts.revisionFormats
  );

  const updateFormats = [
    "styl",
    "stylus",
    "sass",
    "scss",
    "less",
    "css"
  ].concat(opts.updateFormats);

  function buildHashString(filePath, hash) {
    return `${filePath.name}-${hash}${filePath.ext}`;
  }

  function MD5Hash(filePath, contents) {
    const hash = crypto
      .createHash("md5")
      .update(contents)
      .digest("hex")
      .slice(0, 10);
    return buildHashString(filePath, hash);
  }

  function SHA1Hash(filePath, contents) {
    const hash = crypto
      .createHash("sha1")
      .update(contents)
      .digest("hex")
      .slice(0, 10);
    return buildHashString(filePath, hash);
  }

  function timestampHash(filePath) {
    const hash = crypto
      .createHash("md5")
      .update(new Date().toISOString())
      .digest("hex")
      .slice(0, 10);
    return buildHashString(filePath, hash);
  }

  const HashFunctions = {
    MD5: MD5Hash,
    Timestamp: timestampHash,
    SHA1: SHA1Hash
  };

  const allExtensions = revisionFormats.concat(updateFormats);

  // Create a stream to take in images
  const files = [];
  const onData = function onData(file, encoding, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    let skip = false;
    const fileExt = path.extname(file.path);

    // Collect renames from reved files.
    if (file.revOrigPath) {
      renames.push({
        originalName: file.revOrigBase,
        originalPath: path.normalize(
          path.relative(file.revOrigBase, file.revOrigPath)
        ),
        newName: file.base,
        newPath: path.normalize(path.relative(file.base, file.path))
      });
      skip = !_.includes(updateFormats, fileExt.slice(1, fileExt.length));
    }

    if (!skip && _.includes(allExtensions, fileExt.slice(1, fileExt.length))) {
      files.push(file);
    } else {
      this.push(file);
    }

    cb();
  };

  const onEnd = function onEnd(cb) {
    const that = this;

    const revisionFiles = _.filter(files, function find(file) {
      const ext = path.extname(file.path);
      return _.includes(revisionFormats, ext.slice(1, ext.length));
    });

    const updateFiles = _.filter(files, function find(file) {
      const ext = path.extname(file.path);
      return _.includes(updateFormats, ext.slice(1, ext.length));
    });

    revisionFiles.forEach(function hashFiles(file) {
      const hashFunc = _.isFunction(opts.hashFunction)
        ? opts.hashFunction
        : HashFunctions[opts.hashFunction];

      const filePath = path.parse(file.path);
      const newName = hashFunc(
        filePath,
        file.isStream() ? file.contents.toString() : file.contents
      );
      const originalName = filePath.base;
      filePath.base = newName;
      const newPath = path.normalize(path.format(filePath)).split(/[?#]/)[0];
      const originalPath = file.path.split(/[?#]/)[0];

      renames.push({
        newName: newName,
        newPath: newPath,
        originalName: originalName,
        originalPath: originalPath
      });

      const newFile = _.merge(file, {
        path: newPath,
        originalName: originalName
      });

      that.push(newFile);
    }, this);

    updateFiles.forEach(function updateFileContent(file) {
      let contents = file.contents.toString();
      renames.forEach(function replace(renamed) {
        contents = contents
          .split(renamed.originalPath)
          .join(renamed.newPath)
          .split(renamed.originalName)
          .join(renamed.newName);
      });

      file.contents = new Buffer(contents);
      that.push(file);
    }, this);

    cb();
  };

  return through2.obj(onData, onEnd);
}

module.exports = spriteSmash;
