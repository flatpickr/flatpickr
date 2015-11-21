var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require("gulp-rename");

gulp.task('compress', function() {
  return gulp.src('src/*.js')
    .pipe(uglify()).on('error', errorHandler)
    .pipe(rename({        suffix: '.min'   }))
    .pipe(gulp.dest('dist'));
});

// Handle the error
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('default', ['compress']);