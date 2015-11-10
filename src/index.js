var through2 = require('through2');
var crypto = require('crypto');
var _ = require('lodash');
var path = require('path');
var gutil = require('gulp-util');

function spriteSmash(params) {
	
	var renames = [];
	var imgFormats = [ 
		'png',
		'jpeg',
		'jpg',
		'svg',
		'gif'
	]
	
	var cssFormats = [
		'styl',
		'stylus',
		'sass',
		'scss',
		'less',
		'css'
	]
	
	var allExtensions = imgFormats.concat(cssFormats);
	
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
		
		// Collect renames from reved files.
		if (file.revOrigPath) {
			renames.push({
				originalName: path.normalise(path.relative(file.revOrigBase, file.revOrigPath)),
				newName: path.normalise(path.relative(file.base, file.path)),
			});
		}
		var fileExt = path.extname(file.path);
		if (_.includes(allExtensions, fileExt.slice(1, fileExt.length))) {
			files.push(file);
		} else {
			this.push(file);
		}
		
		cb();
	};
	
	var onEnd = function (cb) {
		var that = this;
		
		var imageFiles = _.filter(files, function(file) {
			var filePath = path.parse(file.path),
				ext = filePath.ext;
			return _.includes(imgFormats, ext.slice(1, ext.length));
		})
		
		var cssFiles = _.filter(files, function(file) {
			var filePath = path.parse(file.path),
				ext = filePath.ext;
			return _.includes(cssFormats, ext.slice(1, ext.length));
		})
		
		imageFiles.forEach(function(file) {
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
		
		cssFiles.forEach(function(file) {
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