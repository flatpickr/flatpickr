var gulp = require('gulp'),
  less = require('gulp-less'),
  watchLess = require('gulp-watch-less'),
	uglify = require('gulp-uglify'),
	cssmin = require('gulp-cssmin'),
	rename = require("gulp-rename");

gulp.task('less', function () {
  return gulp.src(['src/flatpickr.less', 'src/flatpickr.dark.less'], {base: 'src/'})
    .pipe(less())
    .pipe(cssmin()).on('error', errorHandler)
    .pipe(rename({        suffix: '.min'   }))
    .pipe(gulp.dest('dist'));
});

gulp.task('less-watch', ['less'], function() {
    return gulp.src('src/flatpickr.less')
        .pipe(watchLess('src/flatpickr.less', function() {
            gulp.start('less');
        }));
});



gulp.task('compress-js', function() {
  return gulp.src('src/*.js')
    .pipe(uglify()).on('error', errorHandler)
    .pipe(rename({        suffix: '.min'   }))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch-js', function(){
  gulp.watch('src/**/*.js', ['compress-js']);
});


// Handle the error
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('default', ['compress-js', 'less', 'less-watch','watch-js' ]);