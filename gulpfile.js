const gulp = require("gulp"),
	babel = require("gulp-babel"),
	cssmin = require("gulp-cssmin"),
	lint = require("gulp-eslint"),
	livereload = require("gulp-livereload"),
	plumber = require("gulp-plumber"),
	rename = require("gulp-rename"),
	stylus = require("gulp-stylus"),
	uglify = require("gulp-uglify");

const paths = {
	style: "./src/style/flatpickr.styl",
	script: "./src/flatpickr.js",
	themes: "./src/style/themes/*.styl"
};

function get_script_stream(){
	return gulp.src(paths.script)
	.pipe(plumber())
	.pipe(lint())
	.pipe(lint.format())
	.pipe(babel({presets: ['es2015']}));
}

gulp.task('script', function(done){
	get_script_stream().pipe(gulp.dest('dist'));

	get_script_stream()
	.pipe(uglify({preserveComments: 'license'}))
	.pipe(rename({ suffix: '.min'}))
	.pipe(gulp.dest('dist'))
	.pipe(livereload());

	done();
});

gulp.task('style', function(done){
	gulp.src(paths.style)
	.pipe(plumber())
	.pipe(stylus())
	.pipe(cssmin()).on('error', errorHandler)
	.pipe(rename({ suffix: '.min'}))
	.pipe(gulp.dest('dist'))
	.pipe(livereload());

	done();
});

gulp.task('themes', function(done){
	gulp.src(paths.themes)
	.pipe(plumber())
	.pipe(stylus())
	.pipe(cssmin()).on('error', errorHandler)
	.pipe(rename({ prefix: 'flatpickr.',suffix: '.min'}))
	.pipe(gulp.dest('dist'))
	.pipe(livereload());

	done();
});

gulp.task('watch', function(done) {
	livereload.listen();
	gulp.watch('./src/style/**/*.styl', gulp.parallel('style', 'themes'));
	gulp.watch(paths.script, gulp.series('script'));
	done();
});

// Handle the error
function errorHandler (error) {
	console.log(error.toString());
}

gulp.task('default', gulp.parallel('script', 'style', 'themes', 'watch'));
