const tsc = require("typescript")
const webpackConfig = require("fs").readFileSync("./webpack.config.tsx", "utf8")
const options = {
    compilerOptions: {
        target: "es5",
        module: "commonjs"
    }
}
eval(tsc.transpileModule(webpackConfig, options).outputText)
