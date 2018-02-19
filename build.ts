import * as fs from "fs";
import { promisify } from "util";
import { exec as execCommand } from "child_process";

import * as glob from "glob";

import * as uglifyJS from "uglify-js";

import * as chokidar from "chokidar";
import * as stylus from "stylus";
import * as stylus_autoprefixer from "autoprefixer-stylus";

import * as rollup from "rollup";
import * as rollup_typescript from "rollup-plugin-typescript2";

import * as path from "path";

const pkg = require("./package.json");
const version = `/* flatpickr v${pkg.version},, @license MIT */`;

const paths = {
  themes: "./src/style/themes/*.styl",
  style: "./src/style/flatpickr.styl",
  plugins: "./src/plugins",
  l10n: "./src/l10n",
};

const customModuleNames: Record<string, string> = {
  confirmDate: "confirmDatePlugin",
};

const rollupConfig = {
  inputOptions: {
    input: "",
    plugins: [
      (rollup_typescript as any)({
        abortOnError: false,
        cacheRoot: `/tmp/.rpt2_cache`,
        clean: true,
      }),
    ],
  },
  outputOptions: {
    file: "",
    format: "umd",
    banner: `/* flatpickr v${pkg.version}, @license MIT */`,
  },
};

function logErr(e: Error | string) {
  console.error(e);
}

const writeFileAsync = promisify(fs.writeFile);

function startRollup(dev = false) {
  return execCommand(`npm run rollup:${dev ? "start" : "build"}`);
}

function resolveGlob(g: string) {
  return new Promise<string[]>((resolve, reject) => {
    glob(
      g,
      (err: Error | null, files: string[]) =>
        err ? reject(err) : resolve(files)
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
    writeFileAsync("./dist/flatpickr.min.js", uglify(transpiled));
    console.log("done.");
  } catch (e) {
    logErr(e);
  }
}

function copyFile(source: string, target: string): Promise<any> {
  var rd = fs.createReadStream(source);
  var wr = fs.createWriteStream(target);
  return new Promise(function(resolve, reject) {
    rd.on("error", reject);
    wr.on("error", reject);
    wr.on("finish", resolve);
    rd.pipe(wr);
  }).catch(function(error) {
    rd.destroy();
    wr.end();
    throw error;
  });
}

function buildExtras(folder: "plugins" | "l10n") {
  return async function(changed_path?: string) {
    const [src_paths, css_paths] = await Promise.all([
      changed_path !== undefined
        ? [changed_path]
        : resolveGlob(`./src/${folder}/**/*.ts`),
      resolveGlob(`./src/${folder}/**/*.css`),
    ]);

    await Promise.all([
      ...src_paths.map(async sourcePath => {
        const bundle = await rollup.rollup({
          ...rollupConfig.inputOptions,
          input: sourcePath,
        } as any);

        const fileName = path.basename(sourcePath, path.extname(sourcePath));

        return bundle.write({
          ...rollupConfig.outputOptions,
          file: sourcePath.replace("src", "dist").replace(".ts", ".js"),
          name: customModuleNames[fileName] || fileName,
        } as any);
      }),
      ...css_paths.map(p => copyFile(p, p.replace("src", "dist"))),
    ]);

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
  try {
    const [src, src_ie] = await Promise.all([
      readFileAsync(paths.style),
      readFileAsync("./src/style/ie.styl"),
    ]);

    const [style, min, ie] = await Promise.all([
      transpileStyle(src),
      transpileStyle(src, true),
      transpileStyle(src_ie),
    ]);

    writeFileAsync("./dist/flatpickr.css", style);
    writeFileAsync("./dist/flatpickr.min.css", min);
    writeFileAsync("./dist/ie.css", ie);
  } catch (e) {
    logErr(e);
  }
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
      usePolling: true,
    })
    .on("change", cb)
    .on("error", logErr);
}

function start() {
  const devMode = process.argv.indexOf("--dev") > -1;
  const proc = startRollup(devMode);

  function exit() {
    !proc.killed && proc.kill();
  }

  function log(data: string) {
    process.stdout.write(`rollup: ${data}`);
  }

  proc.stdout.on("data", log);
  proc.stderr.on("data", log);

  proc.stdout.on("readable", () => {
    buildScripts();
  });

  if (devMode) {
    setupWatchers();
  } else {
    buildStyle();
    buildThemes();
    buildExtras("l10n")();
    buildExtras("plugins")();
  }

  //do something when app is closing
  //process.on('exit', proc.kill);

  //catches ctrl+c event
  process.on("SIGINT", exit.bind(null, "SIGKILL"));

  // catches "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", exit.bind(null, "SIGKILL"));
  process.on("SIGUSR2", exit.bind(null, "SIGKILL"));
}

start();

process.on("unhandledRejection", logErr);
