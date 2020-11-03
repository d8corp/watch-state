import Computed, {computed, State, state, watch} from './Computed'

describe('Computed', () => {
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
  })
  describe('class', () => {
    test('fullName', () => {
      const name = new State('Mike')
      const surname = new State('Deight')
      const fullName = new Computed(() => `${name.value} ${surname.value[0]}.`)
      let result, count = 0
      watch(() => {
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
