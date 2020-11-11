import State, {watch} from './State'

describe('state', () => {
  describe('single', () => {
    test('constructor', () => {
      const state = new State('foo')
      expect(state.value).toBe('foo')
    })
    test('writable', () => {
      const state = new State()
      expect(state.value).toBe(undefined)
      state.value = 'foo'
      expect(state.value).toBe('foo')
      state.value = 'bar'
      expect(state.value).toBe('bar')
    })
    test('writable with target', () => {
      const state = new State('foo')
      expect(state.value).toBe('foo')
      state.value = 'bar'
      expect(state.value).toBe('bar')
    })
  })
  describe('with watch', () => {
    test('simple', () => {
      const state = new State('foo')
      let result

      watch(() => result = state.value)
      expect(result).toBe('foo')

      state.value = 'bar'
      expect(result).toBe('bar')

      state.value = 'baz'
      expect(result).toBe('baz')
    })
    test('destructor', () => {
      const state = new State('foo')
      let result

      const watcher = watch(() => result = state.value)
      expect(state.value).toBe('foo')
      expect(result).toBe('foo')

      state.value = 'bar'
      expect(result).toBe('bar')
      expect(state.value).toBe('bar')

      watcher.destructor()

      state.value = 'baz'

      expect(state.value).toBe('baz')
      expect(result).toBe('bar')

      state.value = 'foo'

      expect(state.value).toBe('foo')
      expect(result).toBe('bar')
    })
    test('condition', () => {
      let count1 = 0
      let count2 = 0
      const run = new State(true)
      const state = new State('foo')
      let result
      watch(() => {
        count1++
        if (run.value) {
          count2++
          result = state.value
        }
      })
      expect(result).toBe('foo')
      expect(state.value).toBe('foo')
      expect(count1).toBe(1)
      expect(count2).toBe(1)
      expect(run.value).toBe(true)

      state.value = 'bar'

      expect(result).toBe('bar')
      expect(state.value).toBe('bar')
      expect(count1).toBe(2)
      expect(count2).toBe(2)
      expect(run.value).toBe(true)

      run.value = false

      expect(result).toBe('bar')
      expect(state.value).toBe('bar')
      expect(count1).toBe(3)
      expect(count2).toBe(2)
      expect(run.value).toBe(false)

      state.value = 'baz'

      expect(result).toBe('bar')
      expect(state.value).toBe('baz')
      expect(count1).toBe(3)
      expect(count2).toBe(2)
      expect(run.value).toBe(false)
    })
    test('set state in watch', () => {
      let count = 0
      const state1 = new State('foo')
      const state2 = new State('')
      watch(() => {
        count++
        state2.value = `(${state1.value})`
      })
      expect(count).toBe(1)
      expect(state1.value).toBe('foo')
      expect(state2.value).toBe('(foo)')

      state2.value = 'bar'

      expect(count).toBe(1)
      expect(state1.value).toBe('foo')
      expect(state2.value).toBe('bar')

      state1.value = 'baz'

      expect(count).toBe(2)
      expect(state1.value).toBe('baz')
      expect(state2.value).toBe('(baz)')
    })
    describe('deep', () => {
      test('auto-remove', () => {
        let count = 0
        const run = new State(true)
        const state = new State('foo')
        let result
        watch(() => {
          count++
          if (run.value) {
            watch(() => result = state.value)
          }
        })
        expect(result).toBe('foo')
        expect(state.value).toBe('foo')
        expect(count).toBe(1)
        expect(run.value).toBe(true)

        state.value = 'bar'

        expect(result).toBe('bar')
        expect(state.value).toBe('bar')
        expect(count).toBe(1)
        expect(run.value).toBe(true)

        run.value = false

        expect(result).toBe('bar')
        expect(state.value).toBe('bar')
        expect(count).toBe(2)
        expect(run.value).toBe(false)

        state.value = 'baz'

        expect(result).toBe('bar')
        expect(state.value).toBe('baz')
        expect(count).toBe(2)
        expect(run.value).toBe(false)
      })
      test('double value', () => {
        const state = new State()
        let render1 = []
        let render2 = []

        watch(() => {
          render1.push([state.value, state.value])
          watch(() => {
            render2.push([state.value, state.value])
          })
        })
        expect(render1.length).toBe(1)
        expect(render2.length).toBe(1)
        expect(render1[0]).toEqual([undefined, undefined])
        expect(render2[0]).toEqual([undefined, undefined])

        state.value = true
        expect(render1.length).toBe(2)
        expect(render2.length).toBe(2)
        expect(render1[1]).toEqual([true, true])
        expect(render2[1]).toEqual([true, true])
      })
    })
  })
})
