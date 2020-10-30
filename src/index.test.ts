import {watch, State, reset, state, lock, action, onDestructor} from '.'
import Computed, {computed} from './Computed'

describe('watch-state', () => {
  test('simple', () => {
    const state = new State('foo')
    let result
    watch(() => result = state.value)
    expect(result).toBe('foo')

    state.value = 'bar'
    expect(result).toBe('bar')

    state.value = 'baz'
    expect(result).toBe('baz')
  })
  test('destructor', () => {
    const state = new State('foo')
    let result

    const watcher = watch(() => result = state.value)
    expect(state.value).toBe('foo')
    expect(result).toBe('foo')

    state.value = 'bar'
    expect(result).toBe('bar')
    expect(state.value).toBe('bar')

    watcher.destructor()

    state.value = 'baz'

    expect(state.value).toBe('baz')
    expect(result).toBe('bar')
  })
  test('condition', () => {
    let count = 0
    const run = new State(true)
    const state = new State('foo')
    let result
    watch(() => {
      count++
      if (run.value) {
        result = state.value
      }
    })
    expect(result).toBe('foo')
    expect(state.value).toBe('foo')
    expect(count).toBe(1)
    expect(run.value).toBe(true)

    state.value = 'bar'

    expect(result).toBe('bar')
    expect(state.value).toBe('bar')
    expect(count).toBe(2)
    expect(run.value).toBe(true)

    run.value = false

    expect(result).toBe('bar')
    expect(state.value).toBe('bar')
    expect(count).toBe(3)
    expect(run.value).toBe(false)

    state.value = 'baz'

    expect(result).toBe('bar')
    expect(state.value).toBe('baz')
    expect(count).toBe(3)
    expect(run.value).toBe(false)
  })
  test('set state in watch', () => {
    let count = 0
    const state1 = new State('foo')
    const state2 = new State('')
    watch(() => {
      count++
      state2.value = `(${state1.value})`
    })
    expect(count).toBe(1)
    expect(state1.value).toBe('foo')
    expect(state2.value).toBe('(foo)')

    state2.value = 'bar'

    expect(count).toBe(1)
    expect(state1.value).toBe('foo')
    expect(state2.value).toBe('bar')

    state1.value = 'baz'

    expect(count).toBe(2)
    expect(state1.value).toBe('baz')
    expect(state2.value).toBe('(baz)')
  })
  describe('loop', () => {
    test('single loop', () => {
      const state = new State(0)
      expect(() => watch(() => state.value++)).toThrow()
      reset()
    })
    // test('multiple loop', () => {
    //   const state1 = new State(0)
    //   const state2 = new State(0)
    //   watch(() => {
    //     console.log(`state2.value = ${state1.value} + 1`)
    //     state2.value = state1.value + 1
    //   })
    //   expect(() => watch(() => {
    //     const text = `state1.value = ${state2.value} + 1`
    //     console.log('<', text)
    //     state1.value = state2.value + 1
    //     console.log('>', text)
    //   })).toThrow()
    //   reset()
    // })
  })
  test('auto-remove', () => {
    let count = 0
    const run = new State(true)
    const state = new State('foo')
    let result
    watch(() => {
      count++
      if (run.value) {
        watch(() => result = state.value)
      }
    })
    expect(result).toBe('foo')
    expect(state.value).toBe('foo')
    expect(count).toBe(1)
    expect(run.value).toBe(true)

    state.value = 'bar'

    expect(result).toBe('bar')
    expect(state.value).toBe('bar')
    expect(count).toBe(1)
    expect(run.value).toBe(true)

    run.value = false

    expect(result).toBe('bar')
    expect(state.value).toBe('bar')
    expect(count).toBe(2)
    expect(run.value).toBe(false)

    state.value = 'baz'

    expect(result).toBe('bar')
    expect(state.value).toBe('baz')
    expect(count).toBe(2)
    expect(run.value).toBe(false)
  })
  test('lock', () => {
    class Test {
      @state count = 0
      @state watch = true
      @state value = 'foo'
    }
    const test = new Test()
    let result
    watch(() => {
      lock(() => test.count++)
      if (test.watch) {
        result = test.value
      }
    })
    expect(result).toBe('foo')
    expect(test.value).toBe('foo')
    expect(test.count).toBe(1)
    expect(test.watch).toBe(true)

    test.value = 'bar'

    expect(result).toBe('bar')
    expect(test.value).toBe('bar')
    expect(test.count).toBe(2)
    expect(test.watch).toBe(true)

    test.watch = false

    expect(result).toBe('bar')
    expect(test.value).toBe('bar')
    expect(test.count).toBe(3)
    expect(test.watch).toBe(false)

    test.value = 'baz'

    expect(result).toBe('bar')
    expect(test.value).toBe('baz')
    expect(test.count).toBe(3)
    expect(test.watch).toBe(false)
  })
  test('action', () => {
    class Test {
      @action changeBrackets (left, right) {
        this.left = left
        this.right = right
      }
      @state left = ''
      @state right = ''
    }
    const test = new Test()
    const log = []
    watch(() => log.push(`${test.left}value${test.right}`))

    expect(log.length).toBe(1)
    expect(log[0]).toBe('value')

    test.changeBrackets('(', ')')

    expect(log.length).toBe(2)
    expect(log[1]).toBe('(value)')

  })
  test('timeout', async () => {
    class Timer {
      @state counting = true
      @state count = 0
    }
    const timer = new Timer()
    let count
    watch(() => {
      if (timer.counting) {
        setTimeout(() => timer.count++, 50)
        count = timer.count
      }
    })

    expect(count).toBe(0)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(count).toBe(1)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(count).toBe(2)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(count).toBe(3)
    timer.counting = false

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(count).toBe(3)
    expect(timer.count).toBe(4)

    timer.counting = true

    expect(count).toBe(4)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(count).toBe(5)
  })
  test('destructor', async () => {
    class Timer {
      @state counting = true
      @state count = 0
    }
    const timer = new Timer()
    let count
    watch(() => {
      if (timer.counting) {
        watch(() => {
          const interval = setInterval(() => timer.count++, 50)
          onDestructor(() => clearInterval(interval))
        })
        watch(() => count = timer.count)
      }
    })

    expect(count).toBe(0)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(count).toBe(1)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(count).toBe(2)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(count).toBe(3)
    timer.counting = false

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(count).toBe(3)

    timer.counting = true

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(count).toBe(4)
  })
  test('update destructor', async () => {
    class Timer {
      @state counting = true
      @state count = 0
    }
    const timer = new Timer()
    let count
    watch(() => {
      if (timer.counting) {
        watch(update => {
          if (!update) {
            const interval = setInterval(() => timer.count++, 50)
            onDestructor(() => clearInterval(interval))
          }
        })
        count = timer.count
      }
    })

    expect(count).toBe(0)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(count).toBe(1)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(count).toBe(2)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(count).toBe(3)
    timer.counting = false

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(count).toBe(3)

    timer.counting = true

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(count).toBe(4)
  })
  describe('computed', () => {
    test('simple', () => {
      let count = 0, result
      class User {
        @state name = 'Mike'
        @state surname = 'Deight'
        @computed get fullName () {
          count++
          return `${this.name} ${this.surname[0]}.`
        }
      }
      const user = new User()
      watch(() => {
        count++
        result = user.fullName
        result = user.fullName
        result = user.fullName
      })
      expect(result).toBe('Mike D.')
      expect(user.fullName).toBe('Mike D.')
      expect(count).toBe(2)

      user.surname = 'D8'
      expect(result).toBe('Mike D.')
      expect(user.fullName).toBe('Mike D.')
      expect(count).toBe(3)

      user.surname = 'Mighty'
      expect(result).toBe('Mike M.')
      expect(user.fullName).toBe('Mike M.')
      expect(count).toBe(5)
    })
    test('auto-remove', () => {
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
      const fullName = new Computed(() => {
        count++
        return `${user.name} ${user.surname[0]}.`
      })
      watch(() => {
        count++
        if (!user.private) {
          result = fullName.value
          result = fullName.value
          result = fullName.value
        }
      })

      expect(result).toBe('Mike D.')
      expect(fullName.value).toBe('Mike D.')
      expect(count).toBe(2)

      user.private = true
      user.surname = 'Mighty'

      expect(result).toBe('Mike D.')
      expect(fullName.value).toBe('Mike M.')
      expect(fullName.value).toBe('Mike M.')
      expect(count).toBe(4)
    })
  })
  describe('Computed', () => {
    test('simple', () => {
      const name = new State('Mike')
      const surname = new State('Deight')
      const computed = new Computed(() => `${name.value} ${surname.value[0]}.`)
      let result, count = 0
      watch(() => {
        count++
        result = computed.value
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
      const fullName = new Computed(() => {
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

      watch(() => {
        resultCount++
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
    })
  })
})
