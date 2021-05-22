import {Watch, state, createEvent} from '/'

describe('createEvent', () => {
  test('brackets', () => {
    class Test {
      changeBrackets = createEvent((left, right) => {
        this.left = left
        this.right = right
      })
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
  test('event inside another event', () => {
    class Test {
      changeBrackets = createEvent((left, right) => {
        this.left = left
        this.right = right
      })
      setFullValue = createEvent((string: string) => {
        this.changeBrackets(string[0], string[string.length - 1])
        this.value = string.slice(1, -1)
      })
      @state value = 'value'
      @state left = ''
      @state right = ''
    }
    const test = new Test()
    const log = []
    new Watch(() => log.push(`${test.left}${test.value}${test.right}`))

    expect(log.length).toBe(1)
    expect(log[0]).toBe('value')

    test.setFullValue('(new)')

    expect(log.length).toBe(2)
    expect(test.value).toBe('new')
    expect(log[1]).toBe('(new)')
  })
})
