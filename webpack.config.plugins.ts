import * as glob from "glob";
import * as path from "path";
import baseConfig, { stylusLoader } from "./webpack.config.base";
import { Configuration, Plugin, Module } from "webpack";

import * as ExtractTextPlugin from "extract-text-webpack-plugin";

export const scripts = glob
  .sync("./src/plugins/*")
  .map((pluginSrcPath): Configuration => ({
    ...baseConfig,
    entry: pluginSrcPath,
    output: {
      path: path.resolve(pluginSrcPath.replace("/src", "/dist")),
      library: "plugin",
      libraryTarget: "umd",
      globalObject: "this",
      filename: `index.js`,
    },
  }));

export const styles = glob
  .sync("./src/plugins/**/*.styl")
  .map((stylePath): Configuration => ({
    ...baseConfig,
    module: {
      rules: [...(<Module>baseConfig.module).rules, stylusLoader(true)],
    },
    entry: stylePath,
    output: {
      path: path.resolve(path.dirname(stylePath.replace("/src", "/dist"))),
      filename: `${path.basename(path.dirname(stylePath))}.css`,
    },
    plugins: [
      ...(<Plugin[]>baseConfig.plugins),
      new ExtractTextPlugin({
        filename: `${path.basename(path.dirname(stylePath))}.css`,
        allChunks: true,
      }),
    ],
  }));
