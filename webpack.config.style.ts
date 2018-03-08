import * as path from "path";
import baseConfig from "./webpack.config.base";
import { Configuration, Module, Plugin } from "webpack";

import * as ExtractTextPlugin from "extract-text-webpack-plugin";

const stylusLoader = (minimize: boolean) => ({
  test: /\.styl$/,
  use: ExtractTextPlugin.extract({
    use: [
      {
        loader: "css-loader",
        options: {
          minimize,
          sourceMap: false,
        },
      },
      {
        loader: "stylus-loader",
      },
    ],
    // use style-loader in development
    fallback: "style-loader",
  }),
});

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

export const unminified = {
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
