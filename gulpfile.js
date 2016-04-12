var gulp = require('gulp'),
stylus = require('gulp-stylus'),
babel = require('gulp-babel'),
cssmin = require('gulp-cssmin'),
uglify = require('gulp-uglify'),
rename = require("gulp-rename");

gulp.task('style', function () {
    return gulp.src('./src/style/flatpickr.styl')
    .pipe(stylus())
    .pipe(cssmin()).on('error', errorHandler)
    .pipe(rename({ suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('themes', function () {
    return gulp.src('./src/style/themes/*.styl')
    .pipe(stylus())
    .pipe(cssmin()).on('error', errorHandler)
    .pipe(rename({ prefix: 'flatpickr.',suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    //gulp.watch('./src/**/*.scss', ['sass']);
    gulp.watch('./src/style/*.styl', ['style']);
    gulp.watch('./src/style/themes/*.styl', ['themes']);
    gulp.watch('src/flatpickr.js', ['compress-js']);
});



gulp.task('compress-js', function() {
    return gulp.src('src/flatpickr.js')
    .pipe(babel({presets: ['es2015']}))
    .pipe(uglify()).on('error', errorHandler)
    .pipe(rename({ suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});



// Handle the error
function errorHandler (error) {
    console.log(error.toString());
}

gulp.task('default', ['compress-js', 'style', 'themes','watch' ]);
