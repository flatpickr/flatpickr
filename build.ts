import * as fs from "fs-extra";
import { exec as execCommand } from "child_process";

import glob from "glob";

import terser from "terser";
import chokidar from "chokidar";
import stylus from "stylus";
import stylus_autoprefixer from "autoprefixer-stylus";

import * as rollup from "rollup";

import * as path from "path";
import rollupConfig, { getConfig } from "./config/rollup";

import * as pkg from "./package.json";
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

function logErr(e: Error | string) {
  console.error(e);
  console.trace();
}

function resolveGlob(g: string) {
  return new Promise<string[]>((resolve, reject) => {
    glob(g, (err: Error | null, files: string[]) =>
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
  const minified = terser.minify(src, {
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

async function buildFlatpickrJs() {
  const bundle = await rollup.rollup(rollupConfig);
  return bundle.write(rollupConfig.output!);
}

async function buildScripts() {
  try {
    await buildFlatpickrJs();
    const transpiled = await fs.readFile("./dist/flatpickr.js");
    fs.writeFile("./dist/flatpickr.min.js", uglify(transpiled.toString()));
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

    try {
      await Promise.all([
        ...src_paths.map(async sourcePath => {
          const bundle = await rollup.rollup({
            ...rollupConfig,
            cache: undefined,
            input: sourcePath,
          });

          const fileName = path.basename(sourcePath, path.extname(sourcePath));

          return bundle.write({
            exports: folder === "l10n" ? "named" : "default",
            format: "umd",
            sourcemap: false,
            file: sourcePath.replace("src", "dist").replace(".ts", ".js"),
            name: customModuleNames[fileName] || fileName,
          });
        }),
        ...(css_paths.map(p => fs.copy(p, p.replace("src", "dist"))) as any),
      ]);
    } catch (err) {
      logErr(err);
    }
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
      .render((err: Error | undefined, css: string) =>
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
  await Promise.all(
    themePaths.map(async themePath => {
      const match = themeRegex.exec(themePath);
      if (!match) return;

      const src = await readFileAsync(themePath);
      return fs.writeFile(
        `./dist/themes/${match[1]}.css`,
        await transpileStyle(src)
      );
    })
  );
  return;
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
  if (devMode) {
    const write = (s: string) => process.stdout.write(`rollup: ${s}`);
    const watcher = rollup.watch([getConfig({ dev: true })]);

    watcher.on("event", logEvent);

    function exit() {
      watcher.close();
      watchers.forEach(w => w.close());
    }

    interface RollupWatchEvent {
      code: string;
      input?: string;
      output?: string;
    }
    function logEvent(e: RollupWatchEvent) {
      write(
        [e.code, e.input && `${e.input} -> ${e.output!}`, "\n"]
          .filter(x => x)
          .join(" ")
      );
    }

    //catches ctrl+c event
    process.on("SIGINT", exit);

    // catches "kill pid" (for example: nodemon restart)
    process.on("SIGUSR1", exit);
    process.on("SIGUSR2", exit);

    setupWatchers();
  }

  buildScripts();
  buildStyle();
  buildThemes();
  buildExtras("l10n")();
  buildExtras("plugins")();
}

start();

process.on("unhandledRejection", logErr);
