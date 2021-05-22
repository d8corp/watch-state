import {cache, Watch, getCache} from '/'

describe('getWatch', () => {
  test('method', () => {
    class Test {
      @cache get field () {
        return 1
      }
    }

    const test = new Test()

    expect(getCache(test, 'field')).toBe(undefined)

    expect(test.field).toBe(1)

    expect(getCache(test, 'field')).toBeInstanceOf(Watch)

    expect(getCache(test, 'field').value).toBe(1)
  })
})
