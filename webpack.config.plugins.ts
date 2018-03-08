import * as glob from "glob";
import * as path from "path";
import baseConfig from "./webpack.config.base";
import { Configuration } from "webpack";

// const config: Configuration = {
//   ...baseConfig,
//   entry: {} as Record<string, string>,
//   output: {
//     path: path.resolve("dist/l10n"),
//     library: "locale",
//     libraryTarget: "umd",
//     globalObject: "this",
//   },
// };

const configs = glob
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
    optimization: {
      minimize: false,
    },
  }));

export default configs;

//export default config;
