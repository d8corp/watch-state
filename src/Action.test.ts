import action from './Action'
import {state, watch} from './State'

describe('action', () => {
  test('brackets', () => {
    class Test {
      @action changeBrackets (left, right) {
        this.left = left
        this.right = right
      }
      @state left = ''
      @state right = ''
    }
    const test = new Test()
    const log = []
    watch(() => log.push(`${test.left}value${test.right}`))

    expect(log.length).toBe(1)
    expect(log[0]).toBe('value')

    test.changeBrackets('(', ')')

    expect(log.length).toBe(2)
    expect(log[1]).toBe('(value)')
  })
})
