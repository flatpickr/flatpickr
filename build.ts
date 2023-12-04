import * as fs from "fs-extra";
import { exec as execCommand } from "child_process";

import glob from "glob";

import terser from "terser";
import chokidar from "chokidar";
import stylus from "stylus";
import stylusAutoprefixer from "autoprefixer-stylus";

import * as rollup from "rollup";

import * as path from "path";
import rollupConfig, { getConfig } from "./config/rollup";

import * as pkg from "./package.json";
const version = `/* flatpickr v${pkg.version},, @license MIT */`;

let DEV_MODE = process.argv.indexOf("--dev") > -1;

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
}

function resolveGlob(g: string) {
  return new Promise<string[]>((resolve, reject) => {
    glob(g, (err: Error | null, files: string[]) =>
      err ? reject(err) : resolve(files)
    );
  });
}

async function readFileAsync(path: string): Promise<string> {
  try {
    const buf = await fs.readFile(path);
    return buf.toString();
  } catch (e) {
    logErr(e);
    return e.toString();
  }
}

async function uglify(src: string) {
  try {
    const { code } = await terser.minify(src, {
      output: {
        preamble: version,
        comments: false,
      },
    });
    return code;
  } catch (err) {
    logErr(err);
  }
}

async function buildFlatpickrJs() {
  const bundle = await rollup.rollup(rollupConfig);
  return bundle.write(rollupConfig.output as rollup.OutputOptions);
}

async function buildScripts() {
  try {
    await buildFlatpickrJs();
    const transpiled = await readFileAsync("./dist/flatpickr.js");
    fs.writeFile("./dist/flatpickr.min.js", await uglify(transpiled));
  } catch (e) {
    logErr(e);
  }
}

function buildExtras(folder: "plugins" | "l10n") {
  return async function (changedPath?: string) {
    const [srcPaths, cssPaths] = await Promise.all(
      changedPath !== undefined
        ? changedPath.endsWith(".ts")
          ? [[changedPath], []]
          : [[], [changedPath]]
        : [
            resolveGlob(`./src/${folder}/**/*.ts`),
            resolveGlob(`./src/${folder}/**/*.css`),
          ]
    );

    try {
      await Promise.all([
        ...srcPaths
          .filter((p) => !p.includes(".spec.ts"))
          .map(async (sourcePath) => {
            const bundle = await rollup.rollup({
              ...rollupConfig,
              cache: undefined,
              input: sourcePath,
            });

            const fileName = path.basename(
              sourcePath,
              path.extname(sourcePath)
            );
            const folderName = path.basename(path.dirname(sourcePath));

            return bundle.write({
              exports: folder === "l10n" ? "named" : "default",
              format: "umd",
              sourcemap: DEV_MODE,
              file: sourcePath.replace("src", "dist").replace(".ts", ".js"),
              name:
                sourcePath.includes("plugins") && fileName === "index"
                  ? `${folderName}Plugin`
                  : customModuleNames[fileName] || fileName,
            });
          }),
        ...(cssPaths.map((p) => fs.copy(p, p.replace("src", "dist"))) as any),
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
      .use(stylusAutoprefixer())
      .render((err, css) => (!err ? resolve(css) : reject(err)));
  });
}

async function buildStyle() {
  try {
    const [src, srcIE] = await Promise.all([
      readFileAsync(paths.style),
      readFileAsync("./src/style/ie.styl"),
    ]);

    await Promise.all([
      fs.writeFile("./dist/flatpickr.css", await transpileStyle(src)),
      fs.writeFile("./dist/flatpickr.min.css", await transpileStyle(src, true)),
      fs.writeFile("./dist/ie.css", await transpileStyle(srcIE)),
    ]);
  } catch (e) {
    logErr(e);
  }
}

const themeRegex = /themes\/(.+).styl/;
async function buildThemes() {
  try {
    const themePaths = await resolveGlob("./src/style/themes/*.styl");
    await Promise.all(
      themePaths.map(async (themePath) => {
        const match = themeRegex.exec(themePath);
        if (!match) return;

        const src = await readFileAsync(themePath);
        return fs.writeFile(
          `./dist/themes/${match[1]}.css`,
          await transpileStyle(src)
        );
      })
    );
  } catch (err) {
    logErr(err);
  }
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

async function start() {
  if (DEV_MODE) {
    (rollupConfig.output as rollup.OutputOptions).sourcemap = true;
    const indexExists = await fs.pathExists("./index.html");
    if (!indexExists) {
      await fs.copyFile("./index.template.html", "./index.html");
    }
    const watcher = rollup.watch([getConfig({ dev: true })]);

    const exit = function () {
      watcher.close();
      watchers.forEach((w) => w.close());
    };

    //catches ctrl+c event
    process.on("SIGINT", exit);

    // catches "kill pid" (for example: nodemon restart)
    process.on("SIGUSR1", exit);
    process.on("SIGUSR2", exit);

    setupWatchers();
  }

  try {
    await fs.mkdirp("./dist/themes");
  } catch {}

  buildScripts();
  buildStyle();
  buildThemes();
  buildExtras("l10n")();
  buildExtras("plugins")();
}

start();
