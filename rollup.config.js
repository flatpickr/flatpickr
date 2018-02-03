// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import serve from 'rollup-plugin-serve';
import livereload from "rollup-plugin-livereload"

const pkg = require("./package.json");

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/flatpickr.js',
    name: "flatpickr",
    format: 'umd',
    exports: "named",
    banner: `/* flatpickr v${pkg.version}, @license MIT */`
  },

  plugins: [
    typescript({
      abortOnError: false,
      cacheRoot: `/tmp/.rpt2_cache`,
      clean: true
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
    include: 'src/**/*.ts',
  }
}
