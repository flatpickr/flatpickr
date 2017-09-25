import * as fs from "fs";
import { promisify } from "util";
import { exec as execCommand } from "child_process";

import * as glob from "glob";

import * as uglifyJS from "uglify-js";
import { ncp } from "ncp";
import * as chokidar from "chokidar";
import * as stylus from "stylus";
import * as stylus_autoprefixer from "autoprefixer-stylus";

import * as typescript from "typescript";
const tsconfig = require("./tsconfig.json");

const pkg = require("./package.json");
const version = `/* flatpickr v${pkg.version},, @license MIT */`;

const paths = {
  themes: "./src/style/themes/*.styl",
  style: "./src/style/flatpickr.styl",
  plugins: "./src/plugins",
  l10n: "./src/l10n",
};

function logErr(e: Error | string) {
  console.error(e);
}

const writeFileAsync = promisify(fs.writeFile);
const removeFile = promisify(fs.unlink);

function startRollup(dev = false) {
  return new Promise((resolve, reject) => {
    execCommand(
      `npm run rollup:${dev ? "start" : "build"}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return reject();
        }

        console.log(stdout);
        console.log(stderr);
        resolve();
      }
    );
  });
}

function resolveGlob(g: string) {
  return new Promise<string[]>((resolve, reject) => {
    glob(
      g,
      (err: Error, files: string[]) => (err ? reject(err) : resolve(files))
    );
  });
}

async function recursiveCopy(src: string, dest: string) {
  return new Promise((resolve, reject) => {
    ncp(
      src,
      dest,
      (err: Error | undefined) => (!err ? resolve() : reject(err))
    );
  });
}

async function readFileAsync(path: string) {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(path, (err, buffer) => {
      err ? reject(err) : resolve(buffer.toString());
    });
  });
}

function compile(src: string, config = tsconfig) {
  //return typescript.transpileModule(src, config).outputText;
  return typescript.transpile(src, config);
}

function uglify(src: string) {
  const minified = uglifyJS.minify(src, {
    output: {
      preamble: version,
      comments: false,
    },
  } as any);

  (minified as any).error && console.log((minified as any).error);
  return minified.code;
}

async function buildScripts() {
  try {
    const transpiled = await readFileAsync("./dist/flatpickr.js");

    writeFileAsync("./dist/flatpickr.min.js", uglify(transpiled)).catch(logErr);
  } catch (e) {
    logErr(e);
  }
}

const extrasConfig = {
  ...tsconfig,
  compilerOptions: {
    ...tsconfig.compilerOptions,
    module: "none",
  },
};
delete extrasConfig.compilerOptions.module;

function buildExtras(folder: "plugins" | "l10n") {
  return async function() {
    console.log(`building ${folder}...`);
    await recursiveCopy(`./src/${folder}`, `./dist/${folder}`);
    const paths = await resolveGlob(`./dist/${folder}/**/*.ts`);

    await Promise.all(
      paths.map(async p => {
        await writeFileAsync(
          p.replace(".ts", ".js"),
          compile(await readFileAsync(p), extrasConfig)
        );
        return removeFile(p);
      })
    );

    console.log("done.");
  };
}

async function transpileStyle(src: string, compress = false) {
  return new Promise<string>((resolve, reject) => {
    stylus(src, {
      compress,
    } as any)
      .include(`${__dirname}/src/style`)
      .include(`${__dirname}/src/style/themes`)
      .use(
        stylus_autoprefixer({
          browsers: pkg.browserslist,
        })
      )
      .render(
        (err: Error | undefined, css: string) =>
          !err ? resolve(css) : reject(err)
      );
  });
}

async function buildStyle() {
  const [src, src_ie] = await Promise.all([
    readFileAsync(paths.style),
    readFileAsync("./src/style/ie.styl"),
  ]);

  const [style, min, ie] = await Promise.all([
    transpileStyle(src),
    transpileStyle(src, true),
    transpileStyle(src_ie),
  ]);

  writeFileAsync("./dist/flatpickr.css", style).catch(logErr);
  writeFileAsync("./dist/flatpickr.min.css", min).catch(logErr);
  writeFileAsync("./dist/ie.css", ie).catch(logErr);
}

const themeRegex = /themes\/(.+).styl/;
async function buildThemes() {
  const themePaths = await resolveGlob("./src/style/themes/*.styl");
  themePaths.forEach(themePath => {
    const match = themeRegex.exec(themePath);
    if (!match) return;

    readFileAsync(themePath)
      .then(transpileStyle)
      .then(css => writeFileAsync(`./dist/themes/${match[1]}.css`, css));
  });
}

function setupWatchers() {
  watch("./src/plugins", buildExtras("plugins"));
  watch("./src/style/*.styl", () => {
    buildStyle();
    buildThemes();
  });
  watch("./src/style/themes", buildThemes);
}

function watch<F extends () => void>(path: string, cb: F) {
  chokidar
    .watch(path, {
      awaitWriteFinish: {
        stabilityThreshold: 100,
      },
    })
    .on("change", cb)
    .on("error", logErr);
}

function start() {
  const devMode = process.argv.indexOf("--dev") > -1;
  startRollup(devMode).then(buildScripts);

  if (devMode) {
    setupWatchers();
  } else {
    buildStyle();
    buildThemes();
    buildExtras("l10n")();
    buildExtras("plugins")();
  }
}

start();

process.on("unhandledRejection", logErr);
