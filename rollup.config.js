import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'
import {terser} from 'rollup-plugin-terser'

const def = {
  input: {
    index: 'src/index.ts',
    Scope: 'src/Scope.ts',
    Action: 'src/Action.ts',
    Computed: 'src/Computed.ts',
    State: 'src/State.ts',
    stateValue: 'src/stateValues.ts',
    Watch: 'src/Watch.ts',
    utils: 'src/utils.ts',
  }
}

export default [{
  ...def,
  output: {
    dir: 'lib',
    entryFileNames: '[name]' + pkg.main.replace('index', ''),
    format: 'cjs'
  },
  plugins: [
    typescript({
      rollupCommonJSResolveHack: false,
      clean: true,
    })
  ]
}, {
  ...def,
  output: {
    dir: 'lib',
    entryFileNames: '[name]' + pkg.module.replace('index', ''),
    format: 'es'
  },
  plugins: [
    typescript({
      rollupCommonJSResolveHack: false,
      clean: true,
      tsconfigOverride: {
        compilerOptions: {
          target: 'es6'
        }
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
    })
  ]
}]
