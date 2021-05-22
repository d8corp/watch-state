import Cache from '.'
import State from '../State'
import Watch from '../Watch'

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
  describe('update method', () => {
    it('has the method', () => {
      const cache = new Cache(() => {})
      expect('update' in cache).toBe(true)
      expect(typeof cache.update).toBe('function')
    })
    it('runs the watcher with update', () => {
      let test = 0
      const cache = new Cache(() => test++)

      expect(test).toBe(0)

      cache.update()
      expect(test).toBe(1)

      cache.update()
      expect(test).toBe(2)
    })
    it('runs the watcher with value', () => {
      let test = 0
      const cache = new Cache(() => test++)

      expect(test).toBe(0)
      expect(cache.value).toBe(0)
      expect(test).toBe(1)

      expect(cache.value).toBe(0)
      expect(test).toBe(1)
    })
    test('deep cache destroy', () => {
      let test1 = 0
      let test2 = 0
      let cache1: Cache
      const cache2 = new Cache(() => {
        test1++
        cache1 = new Cache(() => test2++, false, true)
      }, false, true)

      let watcherTest = cache1
      expect(test1).toBe(1)
      expect(test2).toBe(1)
      expect(watcherTest).toBe(cache1)

      cache1.update()
      expect(test1).toBe(1)
      expect(test2).toBe(2)
      expect(watcherTest).toBe(cache1)

      cache2.update()
      expect(test1).toBe(2)
      expect(test2).toBe(3)
      expect(watcherTest).not.toBe(cache1)
    })
  })
})
