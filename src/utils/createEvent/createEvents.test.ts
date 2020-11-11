import {Watch, state, createEvent} from '../..'

describe('createEvent', () => {
  test('brackets', () => {
    class Test {
      changeBrackets = createEvent((left, right) => {
        this.left = left
        this.right = right
      })
      @state left = ''
      @state right = ''
    }
    const test = new Test()
    const log = []
    new Watch(() => log.push(`${test.left}value${test.right}`))

    expect(log.length).toBe(1)
    expect(log[0]).toBe('value')

    test.changeBrackets('(', ')')

    expect(log.length).toBe(2)
    expect(log[1]).toBe('(value)')
  })
})
