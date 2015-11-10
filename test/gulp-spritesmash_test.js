var assert = require('assert');
var rimraf = require('rimraf');
var fs = require('fs');
var _ = require('lodash');
var childUtils = require('./utils/child.js');

before(function (done) {
  rimraf(__dirname + '/actual-files/', done);
});

describe('gulp-spritesmash', function () {
	describe('running a task without any options', function() {
		childUtils.run('gulp sprite-default-A');
		
		it('generates an image', function () {
			assert.doesNotThrow(function() {
				var files = fs.readdirSync(__dirname + '/actual-files/default/A/')				
				var name = _.find(files, function(item) { 
					return item.match(/sprite-.*/g)
				});
				
				fs.readFileSync(__dirname + '/actual-files/default/A/' + name)
			})
		});
		
		it('generates a css file', function () {
			assert.doesNotThrow(function() {
				fs.readFileSync(__dirname + '/actual-files/default/A/spriteCss.css')
				
				var actualCss = fs.readFileSync(__dirname + '/actual-files/default/A/spriteCss.css', 'utf8');
     			var expectedCss = fs.readFileSync(__dirname + '/expected-files/default/A/spriteCss.css', 'utf8');
				assert.strictEqual(actualCss, expectedCss);				
			})
		});		
	});
	
	describe('running a task without any options - scss', function() {
		childUtils.run('gulp sprite-scss-A');
		
		it('generates an image', function () {
			assert.doesNotThrow(function() {
				var files = fs.readdirSync(__dirname + '/actual-files/scss/A/')				
				var name = _.find(files, function(item) { 
					return item.match(/sprite-.*/g)
				});
				
				fs.readFileSync(__dirname + '/actual-files/scss/A/' + name)
			})
		});
		
		it('generates a css file', function () {
			assert.doesNotThrow(function() {
				fs.readFileSync(__dirname + '/actual-files/scss/A/spriteCss.scss')
				
				var actualCss = fs.readFileSync(__dirname + '/actual-files/scss/A/spriteCss.scss', 'utf8');
     			var expectedCss = fs.readFileSync(__dirname + '/expected-files/scss/A/spriteCss.scss', 'utf8');
				assert.strictEqual(actualCss, expectedCss);				
			})
		});		
	});
});