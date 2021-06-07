import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'
import {terser} from 'rollup-plugin-terser'
import glob from 'glob'

export default [{
  input: glob.sync('{src/index.ts,src/**/index.ts}'),
  output: {
    dir: 'lib',
    entryFileNames: '[name].js',
    format: 'cjs',
    preserveModules: true
  },
  plugins: [
    typescript({
      rollupCommonJSResolveHack: false,
      clean: true,
      tsconfigOverride: {
        exclude: [
          'src/**/*.test.ts'
        ]
      }
    })
  ]
}, {
  input: glob.sync('{src/index.ts,src/**/index.ts}'),
  output: {
    dir: 'lib',
    entryFileNames: '[name]' + pkg.module.replace('index', ''),
    format: 'es',
    preserveModules: true
  },
  plugins: [
    typescript({
      rollupCommonJSResolveHack: false,
      clean: true,
      tsconfigOverride: {
        exclude: [
          'src/**/*.test.ts'
        ]
      }
    })
  ]
}, {
  input: 'src/index.ts',
  output: {
    dir: 'lib',
    entryFileNames: 'watch-state.min.js',
    format: 'iife',
    name: 'watchState',
    plugins: [terser()]
  },
  plugins: [
    typescript({
      rollupCommonJSResolveHack: false,
      clean: true,
      tsconfigOverride: {
        exclude: [
          'src/**/*.test.ts'
        ]
      }
    })
  ]
}]
