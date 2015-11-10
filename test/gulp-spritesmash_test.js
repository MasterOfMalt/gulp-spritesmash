var assert = require('assert');
var rimraf = require('rimraf');
var fs = require('fs');
var _ = require('lodash');
var childUtils = require('./utils/child.js');

before(function (done) {
  rimraf(__dirname + '/actual-files/', done);
});

var names = [
	'default',
	'scss',
	'less'
]

describe('gulp-spritesmash', function () {

	names.forEach(function(name) {
		['A', 'B'].forEach(function(variation) {
			describe(`running a task without any options - ${name} : ${variation}`, function() {
				childUtils.run(`gulp sprite-${name}-${variation}`);
				
				it('generates an image', function () {
					assert.doesNotThrow(function() {
						var files = fs.readdirSync(__dirname + `/actual-files/${name}/${variation}/`)				
						var spriteFile = _.find(files, function(item) { 
							return item.match(/sprite-.*/g)
						});
						
						fs.readFileSync(__dirname + `/actual-files/${name}/${variation}/${spriteFile}`)
					})
				});
				
				it('generates a css file', function () {
					assert.doesNotThrow(function() {
						var actualFiles = fs.readdirSync(__dirname + `/actual-files/${name}/${variation}/`)				
						var actualCssFile = _.find(actualFiles, function(item) { 
							return item.match(/spriteCss\..*/g)
						});
						
						var expectedFiles = fs.readdirSync(__dirname + `/actual-files/${name}/${variation}/`)				
						var expectedCssFile = _.find(expectedFiles, function(item) { 
							return item.match(/spriteCss\..*/g)
						});
						
						var actualCss = fs.readFileSync(__dirname + `/actual-files/${name}/${variation}/${actualCssFile}`, 'utf8');
						var expectedCss = fs.readFileSync(__dirname + `/expected-files/${name}/${variation}/${expectedCssFile}`, 'utf8');
						assert.strictEqual(actualCss, expectedCss);				
					})
				});
				
			});
		})
	}, this)
	
	describe('running any task', function() {
		childUtils.run('gulp sprite-default-A');
		childUtils.run('gulp sprite-default-B');
		
		it('generates a different image for different content', function () {
			assert.doesNotThrow(function() {
				var filesA = fs.readdirSync(__dirname + '/actual-files/default/A/')				
				var nameA = _.find(filesA, function(item) { 
					return item.match(/sprite-.*/g)
				});
				
				var filesB = fs.readdirSync(__dirname + '/actual-files/default/B/')				
				var nameB = _.find(filesB, function(item) { 
					return item.match(/sprite-.*/g)
				});
				
				assert.notEqual(nameA, nameB);
			})
		});	
	});
});