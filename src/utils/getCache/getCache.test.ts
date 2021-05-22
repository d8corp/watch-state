import getWatch from '.'
import {cache, Watch} from '../..'

describe('getWatch', () => {
  test('method', () => {
    class Test {
      @cache get field () {
        return 1
      }
    }

    const test = new Test()

    expect(getWatch(test, 'field')).toBe(undefined)

    expect(test.field).toBe(1)

    expect(getWatch(test, 'field')).toBeInstanceOf(Watch)

    expect(getWatch(test, 'field').value).toBe(1)
  })
})
