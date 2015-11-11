# gulp-sprite-smash

> Versions your static assests based on their content 
  and updates all references to them in other passed files.

> `sprite.png` → `sprite-e59ace00a5.png`

> `sprite.css`
```css
  .icon-sprite1 {
    background-image: url(sprite-e59ace00a5.png);
    background-position: 0px 0px;
    width: 32px;
    height: 32px;
  }
```

This was written because spritesmith generates a new image and
new css from the input images. Spritesmash will take each image
hash the contents and update the name and replace all usages in
the given file types allowing the sprite image to be busted if it
has changed.

## Install
```
$ npm install --save-dev gulp-spritesmash
```

## Usage
```js
var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var spritesmash = require('gulp-spritesmash');

gulp.task('default', function () {
	return gulp.src('src/images/*.{png}')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css',
    }))
    .pipe(spritesmash())
    .pipe(gulp.dest('dist'));
});
```

## API
### spritesmash([options])
#### options
##### updateFormats
Type: `array`

Default: `[]`

Array of extra file types to update filenames with
content hash. These should be provided without `.`

##### revisionFormats
Type: `array`

Default: `[]`

Array of extra file types to update content with
renamed files. These should be provided without `.`

##### hashFunction
Type: `string|function(filePath, content)`

Default: `MD5`

Function type (`MD5`, `SHA1`, `Timestamp`) or a function
which returns new file name for given content and file
path.

### Original path

Original file paths are stored at `file.originalName`. This
could come in handy for things like rewriting references to
the assets.