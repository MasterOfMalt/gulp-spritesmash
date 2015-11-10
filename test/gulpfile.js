var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var spritesmash = require('../src/index.js');

// Define our test tasks
var images = [
  'test-files/sprite1.png',
  'test-files/sprite2.png',
  'test-files/sprite3.png',
  'test-files/sprite4.png',
  'test-files/sprite5.png'
];

gulp.task('sprite-default', function () {
  return gulp.src(images)
    .pipe(spritesmith({
      imgName: './folder/sprite.png',
      cssName: 'sprite.css'
    }))
    .pipe(spritesmash())
  	.pipe(gulp.dest('actual-files/default/'));
});