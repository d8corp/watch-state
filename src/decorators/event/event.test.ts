import {state, event, Watch} from '../..'
import event1 from '.'

describe('event', () => {
  test('export default', () => {
    expect(event1).toBe(event)
  })
  test('brackets', () => {
    class Test {
      @event changeBrackets (left, right) {
        this.left = left
        this.right = right
      }
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
