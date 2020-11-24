import {Watch, State, reset} from '../..'

describe('reset', () => {
  describe('loop', () => {
    test('single loop', () => {
      const state = new State(0)
      expect(() => new Watch(() => state.value++)).toThrow()
      reset()
    })
    test('multiple loop', () => {
      const state1 = new State(0)
      const state2 = new State(0)
      new Watch(() => {
        state2.value = state1.value + 1
      })
      expect(() => new Watch(() => {
        state1.value = state2.value + 1
      })).toThrow()
      reset()
    })
  })
})
