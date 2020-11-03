import {watch, State, reset, state, lock} from '.'

describe('utils', () => {
  test('lock', () => {
    class Test {
      @state count = 0
      @state watch = true
      @state value = 'foo'
    }
    const test = new Test()
    let result
    watch(() => {
      lock(() => test.count++)
      if (test.watch) {
        result = test.value
      }
    })
    expect(result).toBe('foo')
    expect(test.value).toBe('foo')
    expect(test.count).toBe(1)
    expect(test.watch).toBe(true)

    test.value = 'bar'

    expect(result).toBe('bar')
    expect(test.value).toBe('bar')
    expect(test.count).toBe(2)
    expect(test.watch).toBe(true)

    test.watch = false

    expect(result).toBe('bar')
    expect(test.value).toBe('bar')
    expect(test.count).toBe(3)
    expect(test.watch).toBe(false)

    test.value = 'baz'

    expect(result).toBe('bar')
    expect(test.value).toBe('baz')
    expect(test.count).toBe(3)
    expect(test.watch).toBe(false)
  })
  describe('loop', () => {
    test('single loop', () => {
      const state = new State(0)
      expect(() => watch(() => state.value++)).toThrow()
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
