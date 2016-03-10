var gulp = require('gulp'),
  sass = require('gulp-sass'),
	cssmin = require('gulp-cssmin'),
  uglify = require('gulp-uglify'),
	rename = require("gulp-rename");

gulp.task('sass', function () {
  return gulp.src(['src/flatpickr.scss', 'src/flatpickr.dark.scss'], {base: 'src/'})
    .pipe(sass())
    .pipe(cssmin()).on('error', errorHandler)
    .pipe(rename({        suffix: '.min'   }))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*.scss', ['sass']);
  gulp.watch('src/flatpickr.js', ['compress-js']);
});



gulp.task('compress-js', function() {
  return gulp.src('src/flatpickr.js')
    .pipe(uglify()).on('error', errorHandler)
    .pipe(rename({        suffix: '.min'   }))
    .pipe(gulp.dest('dist'));
});



// Handle the error
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('default', ['compress-js', 'sass', 'watch' ]);