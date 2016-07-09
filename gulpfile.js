const gulp = require("gulp"),
	babel = require("gulp-babel"),
	cssmin = require("gulp-cssmin"),
	lint = require("gulp-eslint"),
	plumber = require("gulp-plumber"),
	rename = require("gulp-rename"),
	stylus = require("gulp-stylus"),
	uglify = require("gulp-uglify");

const paths = {
	style: "./src/style/flatpickr.styl",
	script: "./src/flatpickr.js",
	themes: "./src/style/themes/*.styl"
};

gulp.task('script', function(){
	return gulp.src(paths.script)
	.pipe(plumber())
	.pipe(lint())
	.pipe(lint.format())
	.pipe(babel({presets: ['es2015']}))
	.pipe(uglify({compress: {hoist_funs: false, hoist_vars: false}})).on('error', errorHandler)
	.pipe(rename({ suffix: '.min'}))
	.pipe(gulp.dest('dist'));
});

gulp.task('style', function(){
	return gulp.src(paths.style)
	.pipe(plumber())
	.pipe(stylus())
	.pipe(cssmin()).on('error', errorHandler)
	.pipe(rename({ suffix: '.min'}))
	.pipe(gulp.dest('dist'));
});

gulp.task('themes', function(){
	return gulp.src(paths.themes)
	.pipe(plumber())
	.pipe(stylus())
	.pipe(cssmin()).on('error', errorHandler)
	.pipe(rename({ prefix: 'flatpickr.',suffix: '.min'}))
	.pipe(gulp.dest('dist'));
});

gulp.task('watch', function(done) {
	gulp.watch('./src/style/**/*.styl', gulp.parallel('style', 'themes'));
	gulp.watch(paths.script, gulp.series('script'));
	done();
});

// Handle the error
function errorHandler (error) {
	console.log(error.toString());
}

gulp.task('default', gulp.parallel('script', 'style', 'themes', 'watch'));