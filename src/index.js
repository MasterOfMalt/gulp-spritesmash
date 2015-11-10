var through2 = require('through2');
var crypto = require('crypto');
var _ = require('lodash');
var path = require('path')

function spriteSmash(params) {
	
	var changedNames = [];
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
	
	// Create a stream to take in images
	var files = [];
	var onData = function (file, encoding, cb) {
		if (file.path) {
			files.push(file);
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
			changedNames.push({
				newName: newName,
				originalName: file.path					
			})
			file.path = newName
		}, this);
		
		cssFiles.forEach(function(file) {
			var contents = file.contents.toString();
			changedNames.forEach(function replace(renamed) {
				contents = contents.split(renamed.originalName).join(renamed.newName);
			});
			file.contents = new Buffer(contents);
		}, this);
		
		for(var i = 0; i < files.length; i++) {
			that.push(files[i]);
		}
		
		cb();
	}
	
	var retStream = through2.obj(onData, onEnd);
	return retStream;
}


module.exports = spriteSmash;