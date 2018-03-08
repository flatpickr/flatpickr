import * as path from "path";
import baseConfig from "./webpack.config.base";
import { Configuration, Plugin } from "webpack";

import * as extract from "extract-text-webpack-plugin";

const config: Configuration = {
  ...baseConfig,
  entry: path.resolve("src/style/flatpickr.styl"),
  output: {
    path: path.resolve("dist"),
    filename: "flatpickr.min.css",
  },
};

(<Plugin[]>config.plugins).push(
  new extract({
    filename: "flatpickr.min.css",
    allChunks: true,
  })
);

export default config;
