var through2 = require('through2');
var crypto = require('crypto');
var _ = require('lodash');
var path = require('path');
var gutil = require('gulp-util');

function spriteSmash(params) {
	
	var renames = [];
	var revisionFormats = [
		'png',
		'jpeg',
		'jpg',
		'svg',
		'gif'
	]
	
	var updateFormats = [
		'styl',
		'stylus',
		'sass',
		'scss',
		'less',
		'css',
		'md'
	]
	
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
				originalName: path.normalize(path.relative(file.revOrigBase, file.revOrigPath)),
				newName: path.normalize(path.relative(file.base, file.path)),
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
			var hash = crypto.createHash('md5').update(file.contents).digest('hex').slice(0, 10);
			var filePath = path.parse(file.path)
			filePath.base = `${filePath.name}-${hash}${filePath.ext}`
			var newName = path.normalize(path.format(filePath))
			var originalName = file.path;
			
			renames.push({
				newName: newName,
				originalName: file.path					
			})
			
			file = _.merge(file, {
				path: newName,
				originalName: originalName
			});
			
			that.push(file);
		}, this);
		
		updateFiles.forEach(function(file) {
			var contents = file.contents.toString();
			renames.forEach(function replace(renamed) {
				contents = contents.split(renamed.originalName).join(renamed.newName);
			});
			file.contents = new Buffer(contents);
			that.push(file);
		}, this);
		
		cb();
	}
	
	var retStream = through2.obj(onData, onEnd);
	return retStream;
}


module.exports = spriteSmash;