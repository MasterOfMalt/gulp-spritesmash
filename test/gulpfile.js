var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var spritesmash = require('../src/index.js');
var rev = require('gulp-rev');

// Define our test tasks
var imagesA = [
  'test-files/sprite1.png',
  'test-files/sprite2.png',
  'test-files/sprite3.png',
  'test-files/sprite4.png',
  'test-files/sprite5.png'
];

// Define our test tasks
var imagesB = [
  'test-files/sprite1.png',
  'test-files/sprite2.png',
  'test-files/sprite3.png',
  'test-files/sprite4-diff.png',
  'test-files/sprite5.png'
];

var otherFiles = [
  'test-files/text.txt'
]

gulp.task('sprite-default-A', function () {
  return gulp.src(imagesA)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'spriteCss.css'
    }))
    .pipe(spritesmash())
  	.pipe(gulp.dest('actual-files/default/A/'));
});

gulp.task('sprite-default-B', function () {
  return gulp.src(imagesB)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'spriteCss.css'
    }))
    .pipe(spritesmash())
  	.pipe(gulp.dest('actual-files/default/B/'));
});


gulp.task('sprite-scss-A', function () {
  return gulp.src(imagesA)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'spriteCss.scss'
    }))
    .pipe(spritesmash())
  	.pipe(gulp.dest('actual-files/scss/A/'));
});

gulp.task('sprite-scss-B', function () {
  return gulp.src(imagesB)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'spriteCss.scss'
    }))
    .pipe(spritesmash())
  	.pipe(gulp.dest('actual-files/scss/B/'));
});

gulp.task('sprite-less-A', function () {
  return gulp.src(imagesA)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'spriteCss.less'
    }))
    .pipe(spritesmash())
  	.pipe(gulp.dest('actual-files/less/A/'));
});

gulp.task('sprite-less-B', function () {
  return gulp.src(imagesB)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'spriteCss.less'
    }))
    .pipe(spritesmash())
  	.pipe(gulp.dest('actual-files/less/B/'));
});

gulp.task('rev-smash-markdown', function() {
  return gulp.src([
    'test-files/sprite4.png',
    'test-files/sprite5.png',
    'test-files/text.md'
  ])
    .pipe(rev())
    .pipe(spritesmash())
    .pipe(gulp.dest('actual-files/rev/'));
})