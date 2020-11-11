import {watch, state} from '../..'

describe('watch', () => {
  test('simple', () => {
    let logger = []

    class Test {
      @state value = 0
      @watch log () {
        logger.push(this.value)
      }
    }

    const test = new Test()

    expect(test.value).toBe(0)
    expect(logger.length).toBe(0)

    test.log()

    expect(logger.length).toBe(1)
    expect(logger[0]).toBe(0)

    test.value = 1
    expect(logger.length).toBe(2)
    expect(logger[1]).toBe(1)
  })
})
