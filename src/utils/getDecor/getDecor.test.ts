import getDecor from '.'
import {state, State} from '../..'

describe('getDecor', () => {
  test('simple', () => {
    class Test {
      @state field1 = 1
    }

    const test = new Test()
    const stateOfField1 = getDecor<'state', typeof test>(test, 'field1')

    expect(stateOfField1).toBeInstanceOf(State)

    expect(stateOfField1.value).toBe(1)

    stateOfField1.value = 2
  })
})
