import * as path from "path";
import baseConfig from "./webpack.config.base";
import { Configuration } from "webpack";

const config: Configuration = {
  ...baseConfig,
  entry: path.resolve("src/index.ts"),
  output: {
    path: path.resolve("dist"),
    filename: "flatpickr.min.js",
  },
};

export default config;
