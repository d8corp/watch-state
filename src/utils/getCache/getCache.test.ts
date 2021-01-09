import getCache from '.'
import {cache, Cache} from '../..'

describe('getCache', () => {
  test('simple', () => {
    class Test {
      @cache get field1 (): number {
        return 1
      }
    }

    const test = new Test()
    let cacheOfField1 = getCache(test, 'field1')

    expect(cacheOfField1).toBe(undefined)

    expect(test.field1).toBe(1)

    cacheOfField1 = getCache(test, 'field1')

    expect(cacheOfField1).toBeInstanceOf(Cache)

    expect(cacheOfField1.value).toBe(1)
  })
})
