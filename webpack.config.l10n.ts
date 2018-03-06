import * as glob from "glob";
import * as path from "path";
import baseConfig from "./webpack.config.base";
import { Configuration } from "webpack";

const config: Configuration = {
  ...baseConfig,
  entry: {} as Record<string, string>,
};

glob
  .sync("./src/l10n/*.ts")
  .forEach(
    f => ((<Record<string, string>>config.entry)[path.basename(f, "ts")] = f)
  );

export default config;
