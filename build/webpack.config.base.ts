import * as path from "path";
import * as webpack from "webpack";

import * as CleanBuildFolder from "clean-webpack-plugin";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import * as LiveReload from "webpack-livereload-plugin";

const VERSION = require("../package.json").version;

const [SOURCE_DIR, BUILD_DIR] = ["src", "dist"];

const PRODUCTION = process.env.NODE_ENV === "production";
const MODE = PRODUCTION ? "production" : "development";

const PLUGINS = {
  common: [
    new webpack.LoaderOptionsPlugin({
      test: /\.styl$/,
      stylus: { preferPathResolver: "webpack" },
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": MODE,
    }),
  ],
  development: [new LiveReload()],
  production: [
    new webpack.HashedModuleIdsPlugin(),
    new CleanBuildFolder(BUILD_DIR),
    new webpack.BannerPlugin({
      banner: `flatpickr v${VERSION}`,
      test: /\.js$/,
    }),
  ],
};

const config: webpack.Configuration = {
  mode: MODE,
  entry: {},
  output: {
    path: path.resolve("dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: "babel-loader" },
          {
            loader: "ts-loader",
            options: { transpileOnly: true, happyPackMode: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["css-loader"],
      },
    ],
  },
  plugins: PLUGINS.common.concat(PLUGINS[MODE]),
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".styl"],
    modules: [SOURCE_DIR, "node_modules"],
    alias: {
      src: path.posix.resolve("src"),
    },
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    open: true,
  },
  devtool: false,
  watch: process.env.watch === "true",
};

export const stylusLoader = (minimize: boolean) => ({
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
      "postcss-loader",
      "stylus-loader",
    ],
  }),
});

export default config;
