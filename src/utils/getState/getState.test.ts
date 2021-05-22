import {getState, state, State} from '/'

describe('getState', () => {
  test('simple', () => {
    class Test {
      @state field1 = 1
    }

    const test = new Test()
    const stateOfField1 = getState(test, 'field1')

    expect(stateOfField1).toBeInstanceOf(State)

    expect(stateOfField1.value).toBe(1)

    stateOfField1.value = 2

    expect(test.field1).toBe(2)
  })
})
