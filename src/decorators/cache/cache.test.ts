import {Watch, State, cache, state} from '../..'
import cache1 from '.'

describe('cache', () => {
  test('export default', () => {
    expect(cache1).toBe(cache)
  })
  test('fullName', () => {
    let renderCount = 0
    let getCount = 0
    let result
    class User {
      @state name = 'Mike'
      @state surname = 'Deight'
      @cache get fullName () {
        getCount++
        return `${this.name} ${this.surname[0]}.`
      }
    }
    const user = new User()

    expect(getCount).toBe(0)

    new Watch(() => {
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
      @cache get fullName () {
        return `${this.name} ${this.surname[0]}.`
      }
    }
    const user = new User()

    new Watch(() => {
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
      @cache get sorted () {
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

    const watcher = new Watch(() => log.push(test.sorted))

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
      @cache get test () {
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
  test('deep cache', () => {
    const log = []

    class Test {
      @state state1 = 0
      @cache get cache1 () {
        log.push(['cache1', this.state1])
        return this.state1
      }
      @cache get cache2 () {
        log.push(['cache2', this.state1, this.cache1])
        return this.cache1
      }
    }

    const test = new Test()
    expect(log.length).toBe(0)

    new Watch(() => {
      log.push(['watch', test.cache2])
    })
    expect(log.length).toBe(3)
    expect(log[0]).toEqual(['cache1', 0])
    expect(log[1]).toEqual(['cache2', 0, 0])
    expect(log[2]).toEqual(['watch', 0])

    test.state1++
    expect(log.length).toBe(6)
    expect(log[3]).toEqual(['cache1', 1])
    expect(log[4]).toEqual(['cache2', 1, 1])
    expect(log[5]).toEqual(['watch', 1])
  })
  test('double deep cache', () => {
    const log = []

    class Router {
      @state _url = '/'
      @cache get url () {
        log.push(['url', this._url])
        return this._url
      }
      @cache get path () {
        const path = this.url.replace(/[?#].*/, '')
        log.push(['path', path])
        return path
      }
    }

    const router = new Router()
    expect(log.length).toBe(0)

    new Watch(() => log.push(['watch', router.path]))

    expect(log.length).toBe(3)
    expect(log[0]).toEqual(['url', '/'])
    expect(log[1]).toEqual(['path', '/'])
    expect(log[2]).toEqual(['watch', '/'])

    router._url = '/test'
    expect(log.length).toBe(6)
    expect(log[3]).toEqual(['url', '/test'])
    expect(log[4]).toEqual(['path', '/test'])
    expect(log[5]).toEqual(['watch', '/test'])

    router._url = '/test?key=1'
    expect(log.length).toBe(8)
    expect(log[6]).toEqual(['url', '/test?key=1'])
    expect(log[7]).toEqual(['path', '/test'])
  })
})
