const gulp = require("gulp"),
	babel = require("gulp-babel"),
	cssmin = require("gulp-cssmin"),
	lint = require("gulp-eslint"),
	livereload = require("gulp-livereload"),
	plumber = require("gulp-plumber"),
	pug = require("gulp-pug"),
	rename = require("gulp-rename"),
	stylus = require("gulp-stylus"),
	uglify = require("gulp-uglify");

const paths = {
	style: "./src/style/flatpickr.styl",
	script: "./src/flatpickr.js",
	themes: "./src/style/themes/*.styl",
	site_style: "./assets/style.styl",
	site: "./site/index.pug"
};

function get_script_stream(){
	return gulp.src(paths.script)
		.pipe(plumber())
		.pipe(lint()).pipe(lint.format())
		.pipe(babel());
}

gulp.task('script', function(done){
	get_script_stream()
	.pipe(gulp.dest('dist'))
	.pipe(livereload());

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

gulp.task('site_style', function(done){
	gulp.src(paths.site_style)
	.pipe(plumber())
	.pipe(stylus())
	.pipe(cssmin()).on('error', errorHandler)
	.pipe(rename({ suffix: '.min'}))
	.pipe(gulp.dest('assets'))
	.pipe(livereload());

	done();
});

gulp.task("site", function(done){
	gulp.src(paths.site)
		.pipe(plumber())
		.pipe(pug())
		.pipe(gulp.dest('./'))
		.pipe(livereload());

	done();
});

gulp.task('watch', function(done) {
	livereload.listen();
	gulp.watch('./src/style/**/*.styl', gulp.parallel('style', 'themes'));
	gulp.watch(paths.script, gulp.series('script'));
	gulp.watch(['./assets/**/*.styl'], gulp.series('site_style'));
	gulp.watch('./site/**/*.pug', gulp.series("site"));
	done();
});

// Handle the error
function errorHandler (error) {
	console.log(error.toString());
}

gulp.task('default', gulp.parallel('script', 'style', 'themes', 'site', 'site_style', 'watch'));
