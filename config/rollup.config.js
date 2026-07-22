import typescript from 'rollup-plugin-typescript2'
import terser from '@rollup/plugin-terser'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')

// relative to project root
const inputFileName = 'src/index.ts'
const commonJSOutputFileName = pkg.main
const browserOutputFileName = 'dist/umd/index.js'
const compressedBrowserOutputFileName = 'dist/umd/index.min.js'
const umdNamespace = 'exportFromJSON'
const umdTSConfig = 'config/tsconfig.umd.json'

const createUMDTemplate = (file, isMinified = false) => ({
  input: inputFileName,
  output: {
    file,
    format: 'umd',
    name: umdNamespace,
  },
  plugins: [
    typescript({
      tsconfig: umdTSConfig,
    }),
    isMinified && terser(),
  ],
})

const config = [
  createUMDTemplate(commonJSOutputFileName),
  createUMDTemplate(browserOutputFileName),
  createUMDTemplate(compressedBrowserOutputFileName, true),
]

export default config
