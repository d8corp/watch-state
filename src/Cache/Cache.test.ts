import {State, Watch} from '..'
import Cache from './Cache'

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

    let watcherTest = cache1
    expect(test1).toBe(1)
    expect(test2).toBe(1)
    expect(watcherTest).toBe(cache1)

    cache1.update()
    cache1.value
    expect(test1).toBe(1)
    expect(test2).toBe(2)
    expect(watcherTest).toBe(cache1)

    cache2.update()
    cache2.value
    expect(test1).toBe(2)
    expect(test2).toBe(3)
    expect(watcherTest).not.toBe(cache1)
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
    const test = new State(1)
    const test1 = new Cache(() => test.value + 1)

    new Watch(() => {
      if (test.value) {
        new Watch(() => log.push(test1.value))
      }
    })
    expect(log).toEqual([2])

    test.value = 0
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
})
