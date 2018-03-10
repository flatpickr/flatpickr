import * as path from "path";
import baseConfig, { stylusLoader } from "./webpack.config.base";
import { Configuration, Module, Plugin } from "webpack";

import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import * as glob from "glob";

export const minified: Configuration = {
  ...baseConfig,
  module: {
    rules: [...(<Module>baseConfig.module).rules, stylusLoader(true)],
  },
  entry: path.resolve("src/style/flatpickr.styl"),
  output: {
    path: path.resolve("dist"),
    filename: "flatpickr.min.css",
  },
  plugins: [
    ...(<Plugin[]>baseConfig.plugins),
    new ExtractTextPlugin({
      filename: "flatpickr.min.css",
      allChunks: true,
    }),
  ],
};

export const unminified: Configuration = {
  ...minified,
  output: {
    path: path.resolve("dist"),
    filename: "flatpickr.css",
  },
  module: {
    rules: [...(<Module>baseConfig.module).rules, stylusLoader(false)],
  },
  plugins: [
    ...(<Plugin[]>baseConfig.plugins),
    new ExtractTextPlugin({
      filename: "flatpickr.css",
      allChunks: true,
    }),
  ],
};

export const themes: Configuration[] = glob
  .sync("./src/style/themes/*")
  .map(themePath => ({
    ...baseConfig,
    entry: themePath,
    output: {
      path: path.resolve("dist/themes"),
      filename: `${path.basename(themePath, ".styl")}.css`,
    },
    module: {
      rules: [...(<Module>baseConfig.module).rules, stylusLoader(false)],
    },
    plugins: [
      ...(<Plugin[]>baseConfig.plugins),
      new ExtractTextPlugin({
        filename: `${path.basename(themePath, ".styl")}.css`,
        allChunks: true,
      }),
    ],
  }));
