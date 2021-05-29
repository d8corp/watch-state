import {State} from 'src'

describe('State', () => {
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
      expect(() => new State(Symbol())).not.toThrow()
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
      const state = new State()

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
})
