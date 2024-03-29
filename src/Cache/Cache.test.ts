import { State, Watch } from '..'
import { Cache } from './Cache'

describe('Cache', () => {
  describe('constructor', () => {
    test('empty watcher without error', () => {
      expect(() => new Cache(() => {})).not.toThrow()
    })
    test('value watcher without error', () => {
      expect(() => new Cache(() => 1)).not.toThrow()
    })
    test('instance of Cache', () => {
      expect(new Cache(() => {})).toBeInstanceOf(Cache)
    })
  })
  describe('fields', () => {
    describe('value', () => {
      let test = 0
      const cache = new Cache(() => test++)

      expect(test).toBe(0)
      expect(cache.value).toBe(0)
      expect(test).toBe(1)

      expect(cache.value).toBe(0)
      expect(test).toBe(1)
    })
  })
  describe('methods', () => {
    describe('destroy', () => {
      it('has the method', () => {
        const cache = new Cache(() => {})
        expect('destroy' in cache).toBe(true)
        expect(typeof cache.destroy).toBe('function')
      })
      it('works', () => {
        let test = 0
        const state = new State(0)
        const cache = new Cache(() => {
          test++
          return state.value
        })

        new Watch(() => cache.value)

        expect(test).toBe(1)

        state.value++
        expect(test).toBe(2)

        state.value++
        expect(test).toBe(3)

        cache.destroy()
        state.value++
        expect(test).toBe(3)
      })
    })
    describe('update', () => {
      it('has the method', () => {
        const cache = new Cache(() => {})
        expect('update' in cache).toBe(true)
        expect(typeof cache.update).toBe('function')
      })
      it('runs target', () => {
        let test = 0
        const cache = new Cache(() => test++)

        expect(test).toBe(0)

        cache.update()
        expect(test).toBe(0)
        expect(cache.value).toBe(0)
        expect(test).toBe(1)

        cache.update()
        expect(test).toBe(1)
        expect(cache.value).toBe(1)
        expect(test).toBe(2)
      })
    })
  })
  test('deep cache destroy', () => {
    let test1 = 0
    let test2 = 0

    let cache1: Cache
    const cache2 = new Cache(() => {
      test1++
      cache1 = new Cache(() => test2++, false, true)
    }, true, true)

    const watcherTest = cache1
    expect(test1).toBe(1)
    expect(test2).toBe(1)
    expect(watcherTest).toBe(cache1)

    cache1.update()
    // eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
    cache1.value
    expect(test1).toBe(1)
    expect(test2).toBe(2)
    expect(watcherTest).toBe(cache1)

    cache2.update()
    // eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
    cache2.value
    expect(test1).toBe(2)
    expect(test2).toBe(3)
    expect(watcherTest).not.toBe(cache1)
  })
  test('deep update', () => {
    const state = new State(0)
    const cache1 = new Cache(() => state.value)
    const cache2 = new Cache(() => cache1.value)

    expect(cache2.value).toBe(0)

    state.value = 1

    expect(cache2.value).toBe(1)
  })

  test('fullName', () => {
    const name = new State('Mike')
    const surname = new State('Deight')
    const fullName = new Cache(() => `${name.value} ${surname.value[0]}.`)
    let result, count = 0
    new Watch(() => {
      count++
      result = fullName.value
    })
    expect(result).toBe('Mike D.')
    expect(count).toBe(1)

    surname.value = 'D8'
    expect(result).toBe('Mike D.')
    expect(count).toBe(1)

    surname.value = 'Mighty'
    expect(count).toBe(2)
    expect(result).toBe('Mike M.')
  })
  test('useless run', () => {
    let count = 0
    const name = new State('Mike')
    const surname = new State('Deight')
    const fullName = new Cache(() => {
      count++
      return `${name.value} ${surname.value[0]}.`
    })
    expect(count).toBe(0)
    expect(fullName.value).toBe('Mike D.')
    expect(count).toBe(1)
    expect(fullName.value).toBe('Mike D.')
    expect(count).toBe(1)

    let resultCount = 0
    let result

    new Watch(() => {
      resultCount++
      result = fullName.value
    })
    expect(count).toBe(1)
    expect(resultCount).toBe(1)
    expect(result).toBe('Mike D.')

    surname.value = 'D8'
    expect(count).toBe(2)
    expect(resultCount).toBe(1)
    expect(result).toBe('Mike D.')

    surname.value = 'Mighty'
    expect(count).toBe(3)
    expect(resultCount).toBe(2)
    expect(result).toBe('Mike M.')
  })
  test('fast destructor', () => {
    new Cache(() => {}).destroy()
  })
  test('auto-destroy', () => {
    const log = []
    const state = new State(1)
    const cache = new Cache(() => state.value + 1)

    new Watch(() => {
      if (state.value) {
        new Watch(() => log.push(cache.value))
      }
    })
    expect(log).toEqual([2])

    state.value = 0
    expect(log).toEqual([2])
  })
  test('without watcher', () => {
    const state = new State(true)
    const test = new Cache(() => state.value)

    expect(test.value).toBe(true)

    state.value = false

    expect(test.value).toBe(false)
  })
  test('without state', () => {
    let state = 1
    const test = new Cache(() => state)

    expect(test.value).toBe(1)

    state = 2

    expect(test.value).toBe(1)
  })
  test('empty clear', () => {
    const test = new Cache(() => {})

    expect(() => test.update()).not.toThrow()
  })
  test('watch dependency', () => {
    const state = new State(0)
    const cache = new Cache(() => state.value * 2)

    const log = []

    new Watch(() => log.push([state.value, cache.value]))

    expect(log).toEqual([[0, 0]])

    state.value = 2

    expect(log).toEqual([[0, 0], [2, 4]])
  })
  test('destroy out cache with cache', () => {
    const fn = jest.fn()
    const state = new State(true)
    const cache1 = new Cache(() => state.value)
    const cache2 = new Cache(() => state.value)

    new Watch(() => {
      if (cache1.value) {
        new Watch(() => fn(cache2.value))
      }
    })

    expect(fn).toBeCalledTimes(1)

    state.value = false

    expect(fn).toBeCalledTimes(1)

    state.value = true

    expect(fn).toBeCalledTimes(2)
  })
  test('destroy out cache', () => {
    const state = new State(true)
    const cache = new Cache(() => state.value)
    const fn = jest.fn()

    new Watch(() => {
      if (cache.value) {
        new Watch(() => fn(state.value))
      }
    })

    expect(fn).toBeCalledTimes(1)

    state.value = false

    expect(fn).toBeCalledTimes(1)
  })
})
