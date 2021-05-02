import {state, Watch} from '../..'
import unwatch from '.'

describe('unwatch', () => {
  test('unwatch', () => {
    class Test {
      @state count = 0
      @state watch = true
      @state value = 'foo'
    }
    const test = new Test()
    let result
    new Watch(() => {
      unwatch(() => test.count++)
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
})
