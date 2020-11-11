import Computed, {State, watch} from './Computed'

describe('Computed', () => {
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
      expect(count).toBe(1)

      let resultCount = 0
      let result

      watch(() => {
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
  })
})
