import typescript from 'rollup-plugin-typescript2'

const uglify = require('rollup-plugin-uglify').uglify
const pkg = require('../package.json')

// relative to project root
const inputFileName = 'src/index.ts'
const outputFileName = pkg.main
const compressedOutputFileName = pkg.main.replace(/\.js$/, '.min.js')
const umdNamespace = 'exportFromJSON'
const umdTSConfig = 'config/tsconfig.umd.json'

const createUMDTemplate = (isUglify = false) => ({
  input: inputFileName,
  output: {
    file: isUglify ? compressedOutputFileName : outputFileName,
    format: 'umd',
    name: umdNamespace,
  },
  plugins: [
    typescript({
      tsconfig: umdTSConfig,
    }),
    isUglify && uglify(),
  ],
})

const config = [
  createUMDTemplate(false),
  createUMDTemplate(true),
]

export default config
