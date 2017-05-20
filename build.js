const fs = require('fs');
const glob = require("glob");

const babel = require("babel-core");
const uglifyJS = require("uglify-js");
const ncp = require("ncp");
const chokidar = require("chokidar");
const stylus = require("stylus");
const stylus_autoprefixer = require("autoprefixer-stylus");

const eslint = new (require("eslint").CLIEngine)();
const lintFormatter = eslint.getFormatter();

const livereload = require("livereload");
const server = require("http-server");
const opn = require("opn");

const paths = {
    script: "./src/flatpickr.js",
    themes: "./src/style/themes/*.styl",
    style: "./src/style/flatpickr.styl",
    plugins: "./src/plugins",
    l10n: "./src/l10n"
}

function logErr(e){
    console.error(e);
}

function lint(code, filename){
    const report = eslint.executeOnText(code, filename);
    if (report.errorCount || report.warningCount)
        process.stdout.write(
            lintFormatter(report.results)
        );

    else
        console.info("Linting: OK ✓")
}

async function recursiveCopy(src, dest) {
    return new Promise((resolve, reject) => {
        ncp(src, dest, err => {
            if (!err)
                resolve();
            else
                reject();
        });
    })
}

async function readFileAsync(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, buffer) => {
            if (err)
                reject(err);
            else
                resolve(buffer.toString());
        })
    })
}

async function writeFileAsync(path, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, (err, ok) => {
            if (err)
                reject(err);
            else
                resolve();
        })
    })
}

function transpile(src){
    return babel.transform(src, {
        "presets": [ "es2015" ],
        "plugins": ["transform-remove-strict-mode", "transform-object-assign"]
    }).code;
}

function uglify(src) {
    const minified = uglifyJS.minify(src, {
        output: {
            comments: /license/
        }
    });

    if (!minified.error)
        return minified.code;
    
    console.error(minified.error);
    return "";    
}

async function buildScripts(){
    const src = await readFileAsync(paths.script).catch(logErr);
    lint(src, paths.script);
    const transpiled = transpile(src);

    writeFileAsync("./dist/flatpickr.js", transpiled).catch(logErr);
    writeFileAsync("./dist/flatpickr.min.js", uglify(transpiled)).catch(logErr);
}

function resolveGlob(g) {
    return new Promise((resolve, reject) => {
        glob(g, (err, files) =>{
            if (err)
                reject(err);

            else
                resolve(files);
        });
    });
}

function buildExtras(folder){
    return async function(){
        await recursiveCopy(`./src/${folder}`, `./dist/${folder}`);
        const paths = await resolveGlob(`./dist/${folder}/**/*.js`);

        paths.forEach(path => {
            readFileAsync(path)
            .then(src => {
                writeFileAsync(path, transpile(src))
                .catch(logErr);
            })
            .catch(logErr);
        });

    }
}

async function transpileStyle(src, compress=false){
    return new Promise((resolve, reject) => {
        stylus(src, {
            compress
        })
        .include(`${__dirname}/src/style`)
        .include(`${__dirname}/src/style/themes`)
        .use(stylus_autoprefixer({
            browsers: [
                "ie >= 9",
                "last 2 versions",
                "safari >= 7"
            ]
        }))
        .render((err, css) => {
            if (!err)
                resolve(css);
            else
                reject(err);
        });
    });
}


async function buildStyle(){
    const [src, src_ie] = await Promise.all([
        readFileAsync(paths.style),
        readFileAsync("./src/style/ie.styl")
    ]);

    const [style, min, ie] = await Promise.all([
        transpileStyle(src),
        transpileStyle(src, true),
        transpileStyle(src_ie)
    ]);

    writeFileAsync("./dist/flatpickr.css", style).catch(logErr);
    writeFileAsync("./dist/flatpickr.min.css", min).catch(logErr);
    writeFileAsync("./dist/ie.css", ie).catch(logErr);
}

async function buildThemes(){
    const themePaths = await resolveGlob("./src/style/themes/*.styl");
    themePaths.forEach(themePath => {
        const themeName = /themes\/(.+).styl/.exec(themePath)[1];
        readFileAsync(themePath)
        .then(transpileStyle)
        .then(css => writeFileAsync(`./dist/themes/${themeName}.css`, css));
    });
}

function setupWatchers(){
    watch(paths.script, buildScripts);
    watch("./src/plugins", buildExtras("plugins"));
    watch("./src/style/*.styl", () => {buildStyle(); buildThemes();});
    watch("./src/style/themes", buildThemes);
}

function serve(){
    livereload.createServer().watch("./dist");
    server.createServer().listen(8080);
}

function watch(path, cb){
    chokidar.watch(path, {
        awaitWriteFinish: {
            stabilityThreshold: 100
        }
    })
    .on('change', cb)
    .on('error', logErr);
}

function start(){
    const devMode = process.argv.includes("--dev");
    if (devMode) {
        process.stdout.write('\033c');
        setupWatchers();
        serve();
        opn("http://localhost:8080");
    }

    else {
        buildScripts();
        buildStyle();
        buildThemes();
        buildExtras("l10n")();
        buildExtras("plugins")();
    }
}

start();

process.on('unhandledRejection', logErr);
