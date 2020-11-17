import {Watch, State} from '../..'
import Mixed from '.'

describe('Mixed', () => {
  test('fullName', () => {
    const name = new State('Mike')
    const surname = new State('Deight')
    const fullName = new Mixed(() => `${name.value} ${surname.value[0]}.`)
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
    const fullName = new Mixed(() => {
      count++
      return `${name.value} ${surname.value[0]}.`
    })
    expect(count).toBe(0)
    expect(fullName.value).toBe('Mike D.')
    expect(count).toBe(1)
    expect(fullName.value).toBe('Mike D.')
    expect(count).toBe(2)

    let resultCount = 0
    let result

    const watcher = new Watch(() => {
      resultCount++
      result = fullName.value
      result = fullName.value
    })
    expect(count).toBe(3)
    expect(resultCount).toBe(1)
    expect(result).toBe('Mike D.')

    surname.value = 'D8'
    expect(count).toBe(4)
    expect(resultCount).toBe(1)
    expect(result).toBe('Mike D.')

    surname.value = 'Mighty'
    expect(count).toBe(5)
    expect(resultCount).toBe(2)
    expect(result).toBe('Mike M.')

    watcher.update()
    expect(count).toBe(6)
    expect(resultCount).toBe(3)
    expect(result).toBe('Mike M.')
  })
})
