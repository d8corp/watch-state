import {Watch, State, mixer, state, watch, cache} from '../..'

describe('mixer', () => {
  test('fullName', () => {
    let renderCount = 0
    let getCount = 0
    let result
    class User {
      @state name = 'Mike'
      @state surname = 'Deight'
      @mixer get fullName () {
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
    expect(getCount).toBe(2)

    user.surname = 'D8'
    expect(result).toBe('Mike D.')
    expect(getCount).toBe(3)
    expect(user.fullName).toBe('Mike D.')
    expect(renderCount).toBe(1)
    expect(getCount).toBe(4)

    user.surname = 'Mighty'
    expect(result).toBe('Mike M.')
    expect(getCount).toBe(5)
    expect(user.fullName).toBe('Mike M.')
    expect(renderCount).toBe(2)
    expect(getCount).toBe(6)
  })
  test('condition', () => {
    let count = 0, result
    class User {
      @state private = false
      @state name = 'Mike'
      @state surname = 'Deight'
      @mixer get fullName () {
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
      @mixer get sorted () {
        count++
        return this.value.sort()
      }
    }
    const test = new Test()
    const log = []
    expect(test.sorted).toEqual([])
    expect(test.sorted).toEqual([])
    expect(count).toBe(2)

    const watcher = new Watch(() => log.push(test.sorted))

    expect(log.length).toBe(1)
    expect(count).toBe(3)
    expect(log[0]).toEqual([])

    test.value = ['b', 'c', 'a']

    expect(log.length).toBe(2)
    expect(count).toBe(4)
    expect(log[1]).toEqual(['a', 'b', 'c'])
    expect(test.sorted).toEqual(['a', 'b', 'c'])
    expect(count).toBe(5)

    watcher.destructor()

    expect(log.length).toBe(2)
    expect(count).toBe(5)
    expect(test.sorted).toEqual(['a', 'b', 'c'])
    expect(count).toBe(6)

    test.value = ['2', '3', '1']
    expect(log.length).toBe(2)
    expect(count).toBe(6)
    expect(test.sorted).toEqual(['1', '2', '3'])
    expect(count).toBe(7)
  })
  test('double creating', () => {
    let count = 0
    const state = new State(0)
    class Test {
      @mixer get test () {
        count++
        return state.value
      }
    }
    const test1 = new Test()
    expect(count).toBe(0)
    expect(test1.test).toBe(0)
    expect(count).toBe(1)
    expect(test1.test).toBe(0)
    expect(count).toBe(2)

    state.value = 1
    expect(count).toBe(2)
    expect(test1.test).toBe(1)
    expect(count).toBe(3)

    const test2 = new Test()
    expect(count).toBe(3)
    expect(test2.test).toBe(1)
    expect(count).toBe(4)
    expect(test2.test).toBe(1)
    expect(count).toBe(5)

    state.value = 2
    expect(count).toBe(5)
    expect(test2.test).toBe(2)
    expect(count).toBe(6)
    expect(test2.test).toBe(2)
    expect(count).toBe(7)
  })
  test('deep cache', () => {
    const log = []

    class Test {
      @state state1 = 0
      @mixer get cache1 () {
        log.push(['cache1', this.state1])
        return this.state1
      }
      @mixer get cache2 () {
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
  test('Component example', () => {
    const log = []
    class Component {
      count = 0
      @mixer get countText () {
        return this.count++ ? `Updated: ${this.count - 1}` : null
      }
      @watch render (): Watch {
        log.push(this.countText ? this.countText : 'First render')
        return
      }
    }

    const component = new Component()

    const rendering = component.render()
    expect(log.length).toBe(1)
    expect(log[0]).toBe('First render')

    rendering.update()
    expect(log.length).toBe(2)
    expect(log[1]).toBe('Updated: 1')

    rendering.update()
    expect(log.length).toBe(3)
    expect(log[2]).toBe('Updated: 2')
  })
  describe('inside mixer', () => {
    test('update', () => {
      let mixer1Count = 0
      let mixer2Count = 0
      class Test {
        text = 'State: '
        @state state = 0
        @mixer get mixer1 () {
          mixer1Count++
          return this.text + this.state
        }
        @mixer get mixer2 () {
          mixer2Count++
          return this.mixer1
        }
      }

      const log = []
      const test = new Test()

      const watcher = new Watch(() => log.push(test.mixer2))

      expect(mixer1Count).toBe(1)
      expect(mixer2Count).toBe(1)
      expect(log.length).toBe(1)
      expect(log[0]).toBe('State: 0')

      test.text = 'State is '
      watcher.update()

      expect(mixer1Count).toBe(2)
      expect(mixer2Count).toBe(2)
      expect(log.length).toBe(2)
      expect(log[1]).toBe('State is 0')
    })
    test('state simply', () => {
      let mixerCount = 0
      class Test {
        @state state = 0
        @mixer get mixer1 () {
          mixerCount++
          return this.state
        }
      }

      const log = []
      const test = new Test()

      new Watch(() => log.push(test.mixer1))
      expect(mixerCount).toBe(1)

      expect(log.length).toBe(1)
      expect(log[0]).toBe(0)

      test.state = 1

      expect(mixerCount).toBe(2)

      expect(log.length).toBe(2)
      expect(log[1]).toBe(1)

      test.state = 2

      expect(mixerCount).toBe(3)
      expect(log.length).toBe(3)
      expect(log[2]).toBe(2)
    })
    test('state', () => {
      let mixer1Count = 0
      let mixer2Count = 0
      class Test {
        text = 'State: '
        @state state = 0
        @mixer get mixer1 () {
          mixer1Count++
          return this.text + this.state
        }
        @mixer get mixer2 () {
          mixer2Count++
          return this.mixer1
        }
      }

      const log = []
      const test = new Test()

      const watcher = new Watch(() => log.push(test.mixer2))

      expect(mixer1Count).toBe(1)
      expect(mixer2Count).toBe(1)
      expect(log.length).toBe(1)
      expect(log[0]).toBe('State: 0')

      test.text = 'State is '
      test.state = 1

      expect(mixer1Count).toBe(2)
      expect(mixer2Count).toBe(2)
      expect(log.length).toBe(2)
      expect(log[1]).toBe('State is 1')

      test.state = 2

      expect(mixer1Count).toBe(3)
      expect(mixer2Count).toBe(3)
      expect(log.length).toBe(3)
      expect(log[2]).toBe('State is 2')
    })
  })
  test('inside cache', () => {
    class Test {
      text = 'State: '
      @state state = 0
      @mixer get mixer () {
        return this.text + this.state
      }
      @cache get cache () {
        return this.mixer
      }
    }

    const log = []
    const test = new Test()

    const watcher = new Watch(() => log.push(test.cache))

    expect(log.length).toBe(1)
    expect(log[0]).toBe('State: 0')

    test.text = 'State is '
    watcher.update()

    expect(log.length).toBe(2)
    // TODO: add using mixer inside cache
    // expect(log[1]).toBe('State is 0')
  })
})
