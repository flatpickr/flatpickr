import * as fs from "fs-extra";
import { exec as execCommand } from "child_process";

import * as glob from "glob";

import * as uglifyJS from "uglify-js";

import * as chokidar from "chokidar";
import * as stylus from "stylus";
import * as stylus_autoprefixer from "autoprefixer-stylus";

import * as rollup from "rollup";
import * as rollup_typescript from "rollup-plugin-typescript";
import * as rollup_babel from "rollup-plugin-babel";

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

const watchers: chokidar.FSWatcher[] = [];

interface RollupOptions {
  input: rollup.InputOptions;
  output: rollup.OutputOptions;
}

const rollupConfig: RollupOptions = {
  input: {
    input: "",
    plugins: [
      rollup_typescript({
        // abortOnError: false,
        // cacheRoot: `/tmp/.rpt2_cache`,
        // clean: true,
        tsconfig: path.resolve("src/tsconfig.json"),
        typescript: require("typescript"),
      }),
      rollup_babel({
        runtimeHelpers: true,
      }),
    ],
  },
  output: {
    file: "",
    format: "umd",
    exports: "auto",
    banner: `/* flatpickr v${pkg.version}, @license MIT */`,
    sourcemap: false,
  },
};

function logErr(e: Error | string) {
  console.error(e);
  console.trace();
}

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
  });

  if (minified.error) {
    logErr(minified.error);
  }
  return minified.code;
}

async function buildScripts() {
  try {
    const transpiled = await fs.readFile("./dist/flatpickr.js");
    fs.writeFile("./dist/flatpickr.min.js", uglify(transpiled.toString()));
    console.log("done.");
  } catch (e) {
    logErr(e);
  }
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
          ...rollupConfig.input,
          cache: undefined,
          input: sourcePath,
        });

        const fileName = path.basename(sourcePath, path.extname(sourcePath));

        return bundle.write({
          ...rollupConfig.output,
          exports: folder === "l10n" ? "named" : "default",
          sourcemap: false,
          file: sourcePath.replace("src", "dist").replace(".ts", ".js"),
          name: customModuleNames[fileName] || fileName,
        });
      }),
      ...(css_paths.map(p => fs.copy(p, p.replace("src", "dist"))) as any),
    ]);

    console.log("done.");
  };
}

// function debounce(func: Function, wait: number, immediate?:boolean) {
//   var timeout: number | NodeJS.Timer | null;
//   return function(this: Function) {
//     var context = this, args = arguments;
//     var later = function() {
//       timeout = null;
//       if (!immediate) func.apply(context, args);
//     };
//     var callNow = immediate && !timeout;
//     clearTimeout(timeout as number);
//     timeout = setTimeout(later, wait);
//     if (callNow) func.apply(context, args);
//   };
// };

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

    fs.writeFile("./dist/flatpickr.css", style);
    fs.writeFile("./dist/flatpickr.min.css", min);
    fs.writeFile("./dist/ie.css", ie);
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
      .then(css => fs.writeFile(`./dist/themes/${match[1]}.css`, css));
  });
}

function setupWatchers() {
  watch("./src/plugins", buildExtras("plugins"));
  watch("./src/style/*.styl", () => {
    buildStyle();
    buildThemes();
  });
  watch("./src/style/themes", buildThemes);
  watch("./src", (path: string) => {
    execCommand(`npm run fmt -- ${path}`, {
      cwd: __dirname,
    });
  });
}

function watch(path: string, cb: (path: string) => void) {
  watchers.push(
    chokidar
      .watch(path, {
        // awaitWriteFinish: {
        //   stabilityThreshold: 500,
        // },
        //usePolling: true,
      })
      .on("change", cb)
      .on("error", logErr)
  );
}

function start() {
  const devMode = process.argv.indexOf("--dev") > -1;
  const proc = startRollup(devMode);

  function exit(signal: string) {
    !proc.killed && proc.kill(signal);
    watchers.forEach(w => w.close());
  }

  function log(data: string) {
    process.stdout.write(`rollup: ${data}`);
  }

  proc.stdout.on("data", log);
  proc.stderr.on("data", log);

  proc.on("exit", () => {
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
