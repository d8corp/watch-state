import getWatch from '.'
import {watch, Watch} from '../..'

describe('getWatch', () => {
  test('simple', () => {
    class Test {
      @watch get field1 () {
        return 1
      }
    }

    const test = new Test()
    const stateOfField1 = getWatch(test, 'field1')

    expect(stateOfField1).toBeInstanceOf(Watch)

    expect(stateOfField1.value).toBe(1)
  })
})
