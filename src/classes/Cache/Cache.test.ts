import {Cache, Watch, State} from '../..'

describe('Cache', () => {
  test('fullName', () => {
    const name = new State('Mike')
    const surname = new State('Deight')
    const fullName = new Cache(() => `${name.value} ${surname.value[0]}.`)
    let result, count = 0
    new Watch(() => {
      count++
      result = fullName.value
    })
    expect(result).toBe('Mike D.')
    expect(count).toBe(1)

    surname.value = 'D8'
    expect(result).toBe('Mike D.')
    expect(count).toBe(1)

    surname.value = 'Mighty'
    expect(result).toBe('Mike M.')
    expect(count).toBe(2)
  })
  test('useless run', () => {
    let count = 0
    const name = new State('Mike')
    const surname = new State('Deight')
    const fullName = new Cache(() => {
      count++
      return `${name.value} ${surname.value[0]}.`
    })
    expect(count).toBe(0)
    expect(fullName.value).toBe('Mike D.')
    expect(count).toBe(1)
    expect(fullName.value).toBe('Mike D.')
    expect(count).toBe(1)

    let resultCount = 0
    let result

    new Watch(() => {
      resultCount++
      result = fullName.value
    })
    expect(count).toBe(1)
    expect(resultCount).toBe(1)
    expect(result).toBe('Mike D.')

    surname.value = 'D8'
    expect(count).toBe(2)
    expect(resultCount).toBe(1)
    expect(result).toBe('Mike D.')

    surname.value = 'Mighty'
    expect(count).toBe(3)
    expect(resultCount).toBe(2)
    expect(result).toBe('Mike M.')
  })
  test('fast destructor', () => {
    new Cache(() => {}).destructor()
  })
  test('auto-destructor', () => {
    const log = []
    const test = new State(1)
    const test1 = new Cache(() => test.value + 1)

    new Watch(() => {
      if (test.value) {
        new Watch(() => log.push(test1.value))
      }
    })
    expect(log).toEqual([2])

    test.value = 0
    expect(log).toEqual([2])
  })
  test('without watcher', () => {
    const state = new State(true)
    const test = new Cache(() => state.value)

    expect(test.value).toBe(true)

    state.value = false

    expect(test.value).toBe(false)
  })
  test('without state', () => {
    let state = 1
    const test = new Cache(() => state)

    expect(test.value).toBe(1)

    state = 2

    expect(test.value).toBe(1)
  })
})
