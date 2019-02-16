const tsc = require("typescript")
const rollupConfig = require("fs").readFileSync("./config/rollup.ts", "utf8")

const options = {
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs"
  }
}

export default eval(tsc.transpileModule(rollupConfig, options).outputText)
