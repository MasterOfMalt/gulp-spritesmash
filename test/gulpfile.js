'use strict';
var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var spritesmash = require('../lib/index.js');
var rev = require('gulp-rev');
var crypto = require('crypto');

// Define our test tasks
var imagesA = [
  'test-files/sprite1.png',
  'test-files/sprite2.png',
  'test-files/sprite3.png',
  'test-files/sprite4.png',
  'test-files/sprite5.png',
];

// Define our test tasks
var imagesB = [
  'test-files/sprite1.png',
  'test-files/sprite2.png',
  'test-files/sprite3.png',
  'test-files/sprite4-diff.png',
  'test-files/sprite5.png',
];

gulp.task('sprite-default-A', function() {
  return gulp.src(imagesA)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'spriteCss.css',
    }))
    .pipe(spritesmash())
    .pipe(gulp.dest('actual-files/default/A/'));
});

gulp.task('sprite-default-B', function() {
  return gulp.src(imagesB)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'spriteCss.css',
    }))
    .pipe(spritesmash())
    .pipe(gulp.dest('actual-files/default/B/'));
});

gulp.task('sprite-scss-A', function() {
  return gulp.src(imagesA)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'spriteCss.scss',
    }))
    .pipe(spritesmash())
    .pipe(gulp.dest('actual-files/scss/A/'));
});

gulp.task('sprite-scss-B', function() {
  return gulp.src(imagesB)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'spriteCss.scss',
    }))
    .pipe(spritesmash())
    .pipe(gulp.dest('actual-files/scss/B/'));
});

gulp.task('sprite-less-A', function() {
  return gulp.src(imagesA)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'spriteCss.less',
    }))
    .pipe(spritesmash())
    .pipe(gulp.dest('actual-files/less/A/'));
});

gulp.task('sprite-less-B', function() {
  return gulp.src(imagesB)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'spriteCss.less',
    }))
    .pipe(spritesmash())
    .pipe(gulp.dest('actual-files/less/B/'));
});

gulp.task('rev-smash-markdown', function() {
  return gulp.src([
    'test-files/sprite4.png',
    'test-files/sprite5.png',
    'test-files/text.md',
  ])
    .pipe(rev())
    .pipe(spritesmash({
      updateFormats: ['md'],
    }))
    .pipe(gulp.dest('actual-files/rev/'));
});

gulp.task('smash-Hash-MD5', function() {
  return gulp.src([
    'test-files/sprite4.png',
    'test-files/sprite5.png',
    'test-files/text.md',
  ])
    .pipe(spritesmash({
      updateFormats: ['md'],
      hashFunction: 'MD5',
    }))
    .pipe(gulp.dest('actual-files/hash/MD5'));
});

gulp.task('smash-Hash-SHA1', function() {
  return gulp.src([
    'test-files/sprite4.png',
    'test-files/sprite5.png',
    'test-files/text.md',
  ])
    .pipe(spritesmash({
      updateFormats: ['md'],
      hashFunction: 'SHA1',
    }))
    .pipe(gulp.dest('actual-files/hash/SHA1'));
});

gulp.task('smash-Hash-timestamp', function() {
  return gulp.src([
    'test-files/sprite4.png',
    'test-files/sprite5.png',
    'test-files/text.md',
  ])
    .pipe(spritesmash({
      updateFormats: ['md'],
      hashFunction: 'Timestamp',
    }))
    .pipe(gulp.dest('actual-files/hash/timestamp'));
});

var i = 0;
gulp.task('smash-Hash-custom', function() {
  return gulp.src([
    'test-files/sprite4.png',
    'test-files/sprite5.png',
    'test-files/text.md',
  ])
    .pipe(spritesmash({
      updateFormats: ['md'],
      hashFunction: function(filePath) {
        i++;
        return `${filePath.name}-${i}-${filePath.ext}`;
      },
    }))
    .pipe(gulp.dest('actual-files/hash/custom'));
});

gulp.task('smash-Hash-custom-query', function() {
  return gulp.src([
    'test-files/sprite4.png',
    'test-files/sprite5.png',
    'test-files/text.md',
  ])
    .pipe(spritesmash({
      updateFormats: ['md'],
      hashFunction: function(filePath, contents) {
        var hash = crypto.createHash('md5').update(contents).digest('hex').slice(0, 10);
        return `${filePath.name}${filePath.ext}?q=${hash}`;
      },
    }))
    .pipe(gulp.dest('actual-files/hash/custom-query'));
});
