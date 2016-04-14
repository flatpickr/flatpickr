import gulp from "gulp"
import stylus from "gulp-stylus"
import babel from "gulp-babel"
import cssmin from "gulp-cssmin"
import lint from "gulp-jshint"
import uglify from "gulp-uglify"
import rename from "gulp-rename"

const paths = {
    style: "src/style/flatpickr.styl",
    script: "src/flatpickr.js",
    themes: "./src/style/themes/*.styl"
};

export function script() {
    return gulp.src(paths.script)
    .pipe(lint({
         'esversion': 6
    }))
    .pipe(lint.reporter('default'))
    .pipe(babel({presets: ['es2015']}))
    .pipe(uglify()).on('error', errorHandler)
    .pipe(rename({ suffix: '.min'}))
    .pipe(gulp.dest('dist'));
};

export function style() {
    return gulp.src(paths.style)
    .pipe(stylus())
    .pipe(cssmin()).on('error', errorHandler)
    .pipe(rename({ suffix: '.min'}))
    .pipe(gulp.dest('dist'));
};

export function themes() {
    return gulp.src(paths.themes)
    .pipe(stylus())
    .pipe(cssmin()).on('error', errorHandler)
    .pipe(rename({ prefix: 'flatpickr.',suffix: '.min'}))
    .pipe(gulp.dest('dist'));
};

export function watch() {
    gulp.watch('./src/style/**/*.styl', gulp.parallel(style, themes));
    gulp.watch(paths.script, script);
};

// Handle the error
function errorHandler (error) {
    console.log(error.toString());
}

const build = gulp.parallel(script, style, themes,watch);
export {build}

export default build;
