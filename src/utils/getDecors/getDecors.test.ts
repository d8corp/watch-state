import getDecors from '.'
import {state} from '../..'

describe('getDecors', () => {
  test('simple', () => {
    class Test {
      @state field1 = 1
    }

    const test = new Test()
    const decors = getDecors<{field1: 'state'}, typeof test>(test)

    expect(Object.keys(decors)).toEqual(['field1'])

    expect(decors.field1.value).toBe(1)

    decors.field1.value = 2
  })
})
