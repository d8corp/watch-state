import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'
import {terser} from 'rollup-plugin-terser'

const def = {
  input: {
    index: 'src/index.ts',
    'classes/index': 'src/classes/index.ts',
    'classes/Cache/index': 'src/classes/Cache/index.ts',
    'classes/Cache/Cache': 'src/classes/Cache/Cache.ts',
    'classes/State/index': 'src/classes/State/index.ts',
    'classes/State/State': 'src/classes/State/State.ts',
    'classes/Watch/index': 'src/classes/Watch/index.ts',
    'classes/Watch/Watch': 'src/classes/Watch/Watch.ts',
    'classes/Mixed/index': 'src/classes/Mixed/index.ts',
    'classes/Mixed/Mixed': 'src/classes/Mixed/Mixed.ts',
    'decorators/index': 'src/decorators/index.ts',
    'decorators/cache/index': 'src/decorators/cache/index.ts',
    'decorators/cache/cache': 'src/decorators/cache/cache.ts',
    'decorators/watch/index': 'src/decorators/watch/index.ts',
    'decorators/watch/watch': 'src/decorators/watch/watch.ts',
    'decorators/state/index': 'src/decorators/state/index.ts',
    'decorators/state/state': 'src/decorators/state/state.ts',
    'decorators/event/index': 'src/decorators/event/index.ts',
    'decorators/event/event': 'src/decorators/event/event.ts',
    'decorators/mixed/index': 'src/decorators/mixed/index.ts',
    'decorators/mixed/mixed': 'src/decorators/mixed/mixed.ts',
    'utils/index': 'src/utils/index.ts',
    'utils/createEvent/index': 'src/utils/createEvent/index.ts',
    'utils/createEvent/createEvent': 'src/utils/createEvent/createEvent.ts',
    'utils/onClear/index': 'src/utils/onClear/index.ts',
    'utils/onClear/onClear': 'src/utils/onClear/onClear.ts',
    'utils/onDestructor/index': 'src/utils/onDestructor/index.ts',
    'utils/onDestructor/onDestructor': 'src/utils/onDestructor/onDestructor.ts',
    'utils/reset/index': 'src/utils/reset/index.ts',
    'utils/reset/reset': 'src/utils/reset/reset.ts',
    'utils/scope/index': 'src/utils/scope/index.ts',
    'utils/scope/scope': 'src/utils/scope/scope.ts',
    'utils/stateValues/index': 'src/utils/stateValues/index.ts',
    'utils/stateValues/stateValues': 'src/utils/stateValues/stateValues.ts',
    'utils/unwatch/index': 'src/utils/unwatch/index.ts',
    'utils/unwatch/unwatch': 'src/utils/unwatch/unwatch.ts',
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
      tsconfigOverride: {
        compilerOptions: {
          module: 'esnext'
        }
      }
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
          target: 'es6',
          module: 'esnext'
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
      tsconfigOverride: {
        compilerOptions: {
          module: 'esnext'
        }
      }
    })
  ]
}]
