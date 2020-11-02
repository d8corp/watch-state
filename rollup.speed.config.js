import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'speed-test.ts',
  output: {
    file: 'speed-test.js',
    format: 'cjs'
  },
  plugins: [
    typescript({
      rollupCommonJSResolveHack: false,
      clean: true,
      tsconfigOverride: {
        compilerOptions: {
          target: 'es6',
          declaration: false
        }
      }
    })
  ]
}
