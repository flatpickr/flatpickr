// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import serve from 'rollup-plugin-serve';
import livereload from "rollup-plugin-livereload"

const pkg = require("./package.json");

export default {
  input: './src/index.ts',
  name: "flatpickr",
  output: {
    file: 'dist/flatpickr.js',
    format: 'umd',
    banner: `/* flatpickr v${pkg.version}, @license MIT */`
  },

  plugins: [
    typescript({
      abortOnError: false,
      cacheRoot: `/tmp/.rpt2_cache`
    }),
    ...process.env.ROLLUP_WATCH ? [serve({
      open: true,
      contentBase: ''
    }),
    livereload()] : []
  ],
  watch: {
    include: 'src/**/*.ts',
  }
}
