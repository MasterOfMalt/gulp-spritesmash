'use strict'

var through2 = require('through2');
var crypto = require('crypto');
var _ = require('lodash');
var path = require('path');
var gutil = require('gulp-util');

function spriteSmash(options) {
	
	var opts = options || {};
	opts.updateFormats = opts.updateFormats || [];
	opts.revisionFormats = opts.revisionFormats || [];
	opts.hashFunction = opts.hashFunction || 'MD5';
	
	var renames = [];
	var revisionFormats = [
		'png',
		'jpeg',
		'jpg',
		'svg',
		'gif'
	].concat(opts.revisionFormats)
	
	var updateFormats = [
		'styl',
		'stylus',
		'sass',
		'scss',
		'less',
		'css'
	].concat(opts.updateFormats)
	
	var HashFunctions = {
		'MD5': MD5Hash,
		'Timestamp': timestampHash,
		'SHA1': SHA1Hash
	}
	
	var allExtensions = revisionFormats.concat(updateFormats);
	
	// Create a stream to take in images
	var files = [];
	var onData = function (file, encoding, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}
		
		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-spritesmash', 'Streaming not supported'));
			return cb();
		}
		var skip = false;
		var fileExt = path.extname(file.path);
		
		// Collect renames from reved files.
		if (file.revOrigPath) {
			renames.push({
				originalName: file.revOrigBase,
				originalPath: path.normalize(path.relative(file.revOrigBase, file.revOrigPath)),
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
	
	var onEnd = function (cb) {
		var that = this;
		
		var revisionFiles = _.filter(files, function(file) {
			var ext = path.extname(file.path);
			return _.includes(revisionFormats, ext.slice(1, ext.length));
		})
		
		var updateFiles = _.filter(files, function(file) {
			var ext = path.extname(file.path);
			return _.includes(updateFormats, ext.slice(1, ext.length));
		})
		
		revisionFiles.forEach(function(file) {			
			var hashFunc = _.isFunction(opts.hashFunction) ? 
							opts.hashFunction :
							HashFunctions[opts.hashFunction];
			
			var filePath = path.parse(file.path)
			var newName = hashFunc(filePath, file.contents);
			var originalName = filePath.base;
			filePath.base = newName;
			var newPath = path.normalize(path.format(filePath)).split(/[?#]/)[0];
			var originalPath = file.path.split(/[?#]/)[0];
						
			renames.push({
				newName: newName,
				newPath: newPath,
				originalName: originalName,
				originalPath: originalPath	
			})
			
			file = _.merge(file, {
				path: newPath,
				originalName: originalName
			});
			
			that.push(file);
		}, this);
		
		updateFiles.forEach(function(file) {
			var contents = file.contents.toString();
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
	}
	
	var retStream = through2.obj(onData, onEnd);
	return retStream;
}

function buildHashString(filePath, hash) {
	return `${filePath.name}-${hash}${filePath.ext}`	
}

function MD5Hash(filePath, contents) {
	var hash = crypto.createHash('md5').update(contents).digest('hex').slice(0, 10);
	return buildHashString(filePath, hash);
}

function SHA1Hash(filePath, contents) {
	var hash = crypto.createHash('sha1').update(contents).digest('hex').slice(0, 10);	
	return buildHashString(filePath, hash);
}

function timestampHash(filePath) {
	var hash = crypto.createHash('md5').update(new Date().toISOString()).digest('hex').slice(0, 10);
	return buildHashString(filePath, hash);
}

module.exports = spriteSmash;