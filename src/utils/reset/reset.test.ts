import {Watch, State, reset} from '/'

describe('reset', () => {
  describe('loop', () => {
    test('single loop', () => {
      const state = new State(0)
      const log = []
      new Watch(() => log.push(state.value++))
      expect(log[0]).toBe(0)
      expect(state.value++).toBe(1)
      expect(log.length).toBe(2)
      expect(log[1]).toBe(2)
      expect(state.value).toBe(3)
      reset()
    })
    test('multiple loop', () => {
      const state1 = new State(0)
      const state2 = new State(0)
      const log1 = []
      const log2 = []
      new Watch(() => {
        log1.push(state2.value = state1.value + 1)
      })
      expect(log1[0]).toBe(1)
      expect(state1.value).toBe(0)
      expect(state2.value).toBe(1)

      new Watch(() => {
        log2.push(state1.value = state2.value + 1)
      })

      expect(log1.length).toBe(2)
      expect(log2.length).toBe(1)
      expect(log1[1]).toBe(3)
      expect(log2[0]).toBe(2)
      expect(state1.value).toBe(2)
      expect(state2.value).toBe(3)

      reset()
    })
  })
})
