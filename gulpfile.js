const gulp = require("gulp"),
	livereload = require("gulp-livereload"),
	cssmin = require("gulp-cssmin"),
	plumber = require("gulp-plumber"),
	pug = require("gulp-pug"),
	rename = require("gulp-rename"),
	stylus = require("gulp-stylus"),
	uglify = require("gulp-uglify");

const paths = {
	site_style: "./assets/style.styl",
	site: "./site/index.pug"
};

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
	gulp.watch(['./assets/**/*.styl'], gulp.series('site_style'));
	gulp.watch('./site/**/*.pug', gulp.series("site"));
	done();
});

// Handle the error
function errorHandler (error) {
	console.log(error.toString());
}

gulp.task('default', gulp.parallel('site', 'site_style', 'watch'));
