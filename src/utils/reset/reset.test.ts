import {Watch, State, reset} from '../..'

describe('reset', () => {
  describe('loop', () => {
    test('single loop', () => {
      const state = new State(0)
      expect(() => new Watch(() => state.value++)).toThrow()
      reset()
    })
    // test('multiple loop', () => {
    //   const state1 = new State(0)
    //   const state2 = new State(0)
    //   watch(() => {
    //     const text = `state2.value = ${state1.value} + 1`
    //     console.log(`1 ==> ${text}`)
    //     state2.value = state1.value + 1
    //     console.log(`1 <== ${text}`)
    //   })
    //   expect(() => watch(() => {
    //     const text = `state1.value = ${state2.value} + 1`
    //     console.log(`2 ==> ${text}`)
    //     state1.value = state2.value + 1
    //     console.log(`2 <== ${text}`, state1.value)
    //   })).toThrow()
    //   reset()
    // })
  })
})
