const fs = require('fs');
const glob = require("glob-fs")({ gitignore: true });

const babel = require("babel-core");
const uglifyJS = require("uglify-js");
const ncp = require("ncp");
const watch = require("node-watch");
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
    console.error(e.message);
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

async function resolveGlob(path) {
    return new Promise((resolve, reject) => {
        glob.readdir(path, (err, files) => {
            if (err)
                reject(err);
            else
                resolve(files);
        });
    });
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
    return uglifyJS.minify(src, {
        fromString: true
    }).code;
}

async function buildScripts(){
    const src = await readFileAsync(paths.script).catch(logErr);
    lint(src, paths.script);
    const transpiled = transpile(src);

    writeFileAsync("./dist/flatpickr.js", transpiled).catch(logErr);
    writeFileAsync("./dist/flatpickr.min.js", uglify(transpiled)).catch(logErr);
}

async function buildExtras(folder){
    return async function(){
        await recursiveCopy(`./src/${folder}`, `./dist/${folder}`);
        const js = await resolveGlob(`./dist/${folder}/**/*.js`);
        js.forEach(path => {
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
        .include(`${__dirname}/src/style/themes`)
        .use(stylus_autoprefixer())
        .render((err, css) => {
            if (!err)
                resolve(css);
            else
                reject(err);
        });
    });
}


async function buildStyle(){
    const src = await readFileAsync(paths.style);
    const [style, min] = await Promise.all([
        transpileStyle(src),
        transpileStyle(src, true),
    ]);

    writeFileAsync("./dist/flatpickr.css", style).catch(logErr);
    writeFileAsync("./dist/flatpickr.min.css", min).catch(logErr);
}

async function buildThemes(){
    const themePaths = await resolveGlob("./src/style/themes/*.styl");
    themePaths.forEach(themePath => {
        const themeName = /\/(\w+).styl/.exec(themePath)[1];
        readFileAsync(themePath)
        .then(transpileStyle)
        .then(css => writeFileAsync(`./dist/themes/${themeName}.css`, css));
    });
}

function setupWatchers(){
    watch(paths.script, buildScripts);
    watch("./src/plugins", {recursive: true}, buildExtras("plugins"));
    watch(paths.style, buildStyle);
    watch("./src/style/themes", {recursive: true}, buildThemes);
}

function serve(){
    livereload.createServer().watch("./dist");
    server.createServer().listen(8080);
    
}

function start(){
    const devMode = process.argv.includes("--dev");
    if (devMode) {
        setupWatchers();
        serve();
    }

    else {
        buildScripts();
        buildStyle();
        buildThemes();
        buildExtras("l10n");
        buildExtras("plugins");
    }
}

start();

process.on('unhandledRejection', (reason, p) => {
    logErr(reason);
});