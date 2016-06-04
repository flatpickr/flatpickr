const gulp = require("gulp");
const stylus = require("gulp-stylus");
const babel = require("gulp-babel");
const cssmin = require("gulp-cssmin");
const lint = require("gulp-jshint");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");

const paths = {
	style: "./src/style/flatpickr.styl",
	script: "./src/flatpickr.js",
	themes: "./src/style/themes/*.styl"
};

gulp.task('script', function(){
	return gulp.src(paths.script)
	.pipe(lint({
		"esversion": 6,
		"unused": true
	}))
	.pipe(lint.reporter('default'))
	.pipe(babel({presets: ['es2015']}))
	.pipe(uglify({compress: {hoist_funs: false, hoist_vars: false}})).on('error', errorHandler)
	.pipe(rename({ suffix: '.min'}))
	.pipe(gulp.dest('dist'));
});  

gulp.task('style', function(){
	return gulp.src(paths.style)
	.pipe(stylus())
	.pipe(cssmin()).on('error', errorHandler)
	.pipe(rename({ suffix: '.min'}))
	.pipe(gulp.dest('dist'));
});

gulp.task('themes', function(){
	return gulp.src(paths.themes)
	.pipe(stylus())
	.pipe(cssmin()).on('error', errorHandler)
	.pipe(rename({ prefix: 'flatpickr.',suffix: '.min'}))
	.pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
	gulp.watch('./src/style/**/*.styl', gulp.parallel('style', 'themes'));
	gulp.watch(paths.script, gulp.series('script'));
});

// Handle the error
function errorHandler (error) {
	console.log(error.toString());
}

gulp.task('default', gulp.parallel('script', 'style', 'themes', 'watch'));