// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import serve from 'rollup-plugin-serve';
import livereload from "rollup-plugin-livereload"

export default {
  input: './src/index.ts',
  name: "flatpickr",
  output: {
    file: 'dist/flatpickr.js',
    format: 'umd'
  },

  plugins: [
    typescript({
      abortOnError: false
    }),
    serve({
      open: true,
      contentBase: ''
    }),
    livereload()
  ],
  watch: {
    include: 'src/**'
  }
}
