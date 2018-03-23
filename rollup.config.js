// rollup.config.js
import typescript from 'rollup-plugin-typescript';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from "rollup-plugin-livereload"

const pkg = require("./package.json");
import path from "path";

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/flatpickr.js',
    name: "flatpickr",
    format: 'umd',
    exports: "default",
    banner: `/* flatpickr v${pkg.version}, @license MIT */`
  },

  plugins: [
    typescript({
      tsconfig: path.resolve("src/tsconfig.json"),
      typescript: require('typescript')
    }),
    babel({
      runtimeHelpers: true
    }),
    ...process.env.ROLLUP_WATCH ? [serve({
      open: true,
      contentBase: '',
      host: '0.0.0.0',
      port: 8000,
    }),
    livereload()] : []
  ],
  watch: {
      chokidar: false
    }
}
