import * as path from "path";
import baseConfig from "./webpack.config.base";
import { Configuration, Plugin } from "webpack";

export const main: Configuration = {
  ...baseConfig,
  entry: path.resolve("src/index.ts"),
  output: {
    path: path.resolve("dist"),
    filename: "flatpickr.min.js",
    library: "flatpickr",
    libraryTarget: "umd",
    libraryExport: "default",
  },
};

export const unminified = {
  ...main,
  output: {
    ...main.output,
    filename: "flatpickr.js",
  },
  optimization: {
    minimize: false,
  },
};
