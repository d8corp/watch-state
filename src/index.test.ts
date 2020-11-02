import {watch, State, reset, state, lock, action} from '.'
import Computed, {computed} from './Computed'

describe('watch-state', () => {
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
    //     const text = `state2.value = ${state1.value} + 1`
    //     console.log(`1 ==> ${text}`)
    //     state2.value = state1.value + 1
    //     console.log(`1 <== ${text}`)
    //   })
    //   expect(() => watch(() => {
    //     const text = `state1.value = ${state2.value} + 1`
    //     console.log(`2 ==> ${text}`)
    //     state1.value = state2.value + 1
    //     console.log(`2 <== ${text}`, state1.value)
    //   })).toThrow()
    //   reset()
    // })
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
