import { createEvent, State, Watch } from '..'

describe('State', () => {
  describe('raw value', () => {
    test('syncs with value and initial', () => {
      const state = new State(0)

      // raw should mirror initial value at construction
      expect(state.raw).toBe(0)
      expect(state.initial).toBe(0)
      expect(state.initial === state.raw).toBe(true)

      // changing value should also update raw
      state.value = 5
      expect(state.value).toBe(5)
      expect(state.raw).toBe(5)
      expect(state.initial === state.raw).toBe(false)

      // after reset, raw should reflect initial again
      state.reset()
      expect(state.value).toBe(0)
      expect(state.raw).toBe(0)
      expect(state.initial === state.raw).toBe(true)
    })
  })

  describe('constructor', () => {
    test('empty constructor without error', () => {
      expect(() => new State()).not.toThrow()
    })

    test('regular constructor without error', () => {
      expect(() => new State(undefined)).not.toThrow()
      expect(() => new State(null)).not.toThrow()
      expect(() => new State(1)).not.toThrow()
      expect(() => new State(Infinity)).not.toThrow()
      expect(() => new State(NaN)).not.toThrow()
      expect(() => new State('1')).not.toThrow()
      expect(() => new State(Symbol(''))).not.toThrow()
      expect(() => new State({})).not.toThrow()
      expect(() => new State([])).not.toThrow()
      expect(() => new State(new Promise(resolve => resolve(1)))).not.toThrow()
    })

    test('instance of State', () => {
      expect(new State()).toBeInstanceOf(State)
    })
  })

  describe('value field', () => {
    test('value', () => {
      const state = new State('foo')
      expect(state.value).toBe('foo')
    })

    test('writable value', () => {
      const state = new State<string | undefined>()

      expect(state.value).toBe(undefined)

      state.value = 'foo'
      expect(state.value).toBe('foo')

      state.value = 'bar'
      expect(state.value).toBe('bar')
    })

    test('writable with default value', () => {
      const state = new State('foo')

      expect(state.value).toBe('foo')

      state.value = 'bar'
      expect(state.value).toBe('bar')
    })
  })

  describe('set method', () => {
    test('updates value and notifies watchers', () => {
      const state = new State(0)
      const log: number[] = []

      new Watch(() => {
        log.push(state.value)
      })

      expect(log).toEqual([0])

      state.set(1)

      expect(state.value).toBe(1)
      expect(log).toEqual([0, 1])
    })

    test('returns void', () => {
      const state = new State('a')

      expect(state.set('b')).toBeUndefined()
      expect(state.value).toBe('b')
    })
  })

  describe('loop', () => {
    test('custom loop', () => {
      const count = new State(0)
      const log: number[] = []

      new Watch(() => {
        if (count.value < 3) {
          createEvent(() => {
            log.push(count.value++)
          })()
        }
      })

      expect(log).toEqual([0, 1, 2])
    })

    test('custom inverse loop', () => {
      const count = new State(0)
      const log: number[] = []

      new Watch(() => {
        if (count.value < 2) {
          log.push(count.value++)
        }
      })

      expect(log).toEqual([1, 0])
    })
  })

  describe('reset method', () => {
    test('resets to initial value', () => {
      const state = new State(5)

      state.value = 10
      expect(state.value).toBe(10)

      state.reset()
      expect(state.value).toBe(5)
    })

    test('resets to initial undefined', () => {
      const state = new State<string | undefined>()

      state.value = 'foo'
      expect(state.value).toBe('foo')

      state.reset()
      expect(state.value).toBeUndefined()
    })

    test('notifies watchers on reset', () => {
      const state = new State(0)
      const log: number[] = []

      new Watch(() => {
        log.push(state.value)
      })

      expect(log).toEqual([0])

      state.value = 5
      expect(log).toEqual([0, 5])

      state.reset()
      expect(log).toEqual([0, 5, 0])
    })

    test('does not notify watchers if already at initial value', () => {
      const state = new State(0)
      const log: number[] = []

      new Watch(() => {
        log.push(state.value)
      })

      expect(log).toEqual([0])

      state.reset()
      expect(log).toEqual([0])
    })

    test('initial field remains unchanged after reset', () => {
      const state = new State(10)

      state.value = 20
      state.reset()

      expect(state.initial === state.value).toBe(true)
    })

    test('multiple resets work correctly', () => {
      const state = new State(1)
      const log: number[] = []

      new Watch(() => {
        log.push(state.value)
      })

      state.value = 2
      state.reset()
      state.value = 3
      state.reset()

      expect(log).toEqual([1, 2, 1, 3, 1])
      expect(state.initial).toBe(1)
    })

    test('reset with object value', () => {
      const initial = { count: 0 }
      const state = new State(initial)

      state.value = { count: 5 }
      expect(state.value.count).toBe(5)

      state.reset()
      expect(state.value).toBe(initial)
      expect(state.value.count).toBe(0)
    })
  })
})
