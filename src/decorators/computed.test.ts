import state from './state'
import {watch} from '../Watch'
import {State} from '../State'
import computed from './computed'

describe('decorator', () => {
  test('fullName', () => {
    let renderCount = 0
    let getCount = 0
    let result
    class User {
      @state name = 'Mike'
      @state surname = 'Deight'
      @computed get fullName () {
        getCount++
        return `${this.name} ${this.surname[0]}.`
      }
    }
    const user = new User()

    expect(getCount).toBe(0)

    watch(() => {
      renderCount++
      result = user.fullName
      result = user.fullName
    })
    expect(result).toBe('Mike D.')
    expect(user.fullName).toBe('Mike D.')
    expect(renderCount).toBe(1)
    expect(getCount).toBe(1)

    user.surname = 'D8'
    expect(result).toBe('Mike D.')
    expect(user.fullName).toBe('Mike D.')
    expect(renderCount).toBe(1)
    expect(getCount).toBe(2)

    user.surname = 'Mighty'
    expect(result).toBe('Mike M.')
    expect(user.fullName).toBe('Mike M.')
    expect(renderCount).toBe(2)
    expect(getCount).toBe(3)
  })
  test('condition', () => {
    let count = 0, result
    class User {
      @state private = false
      @state name = 'Mike'
      @state surname = 'Deight'
      @computed get fullName () {
        return `${this.name} ${this.surname[0]}.`
      }
    }
    const user = new User()

    watch(() => {
      count++
      if (!user.private) {
        result = user.fullName
        result = user.fullName
      }
    })

    expect(result).toBe('Mike D.')
    expect(user.fullName).toBe('Mike D.')
    expect(count).toBe(1)

    user.private = true
    user.surname = 'Mighty'

    expect(result).toBe('Mike D.')
    expect(user.fullName).toBe('Mike M.')
    expect(count).toBe(2)
  })
  test('returns an array', () => {
    let count = 0
    class Test {
      @state value = []
      @computed get sorted () {
        count++
        return this.value.sort()
      }
    }
    const test = new Test()
    const log = []
    expect(test.sorted).toEqual([])
    expect(test.sorted).toEqual([])
    expect(test.sorted).toEqual([])
    expect(count).toBe(1)

    const watcher = watch(() => log.push(test.sorted))

    expect(log.length).toBe(1)
    expect(count).toBe(1)
    expect(log[0]).toEqual([])

    test.value = ['b', 'c', 'a']

    expect(log.length).toBe(2)
    expect(count).toBe(2)
    expect(log[1]).toEqual(['a', 'b', 'c'])
    expect(test.sorted).toEqual(['a', 'b', 'c'])
    expect(count).toBe(2)

    watcher.destructor()

    expect(log.length).toBe(2)
    expect(count).toBe(2)
    expect(test.sorted).toEqual(['a', 'b', 'c'])
    expect(count).toBe(2)

    test.value = ['2', '3', '1']
    expect(count).toBe(2)
    expect(test.sorted).toEqual(['1', '2', '3'])
    expect(test.sorted).toEqual(['1', '2', '3'])
    expect(count).toBe(3)
  })
  test('double creating', () => {
    let count = 0
    const state = new State(0)
    class Test {
      @computed get test () {
        count++
        return state.value
      }
    }
    const test1 = new Test()
    expect(count).toBe(0)
    expect(test1.test).toBe(0)
    expect(count).toBe(1)
    expect(test1.test).toBe(0)
    expect(count).toBe(1)

    state.value = 1
    expect(count).toBe(1)
    expect(test1.test).toBe(1)
    expect(count).toBe(2)

    const test2 = new Test()
    expect(count).toBe(2)
    expect(test2.test).toBe(1)
    expect(count).toBe(3)
    expect(test2.test).toBe(1)
    expect(count).toBe(3)

    state.value = 2
    expect(count).toBe(3)
    expect(test2.test).toBe(2)
    expect(count).toBe(4)
    expect(test2.test).toBe(2)
    expect(count).toBe(4)
  })
})
