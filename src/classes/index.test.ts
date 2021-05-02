import {Watch, State} from '.'

describe('Watch & State', () => {
  test('simple', () => {
    const state = new State('foo')
    let result

    new Watch(() => {
      result = state.value
    })
    expect(result).toBe('foo')

    state.value = 'bar'
    expect(result).toBe('bar')

    state.value = 'baz'
    expect(result).toBe('baz')
  })
  test('destroy', () => {
    const state = new State('foo')
    let result

    const watcher = new Watch(() => result = state.value)
    expect(state.value).toBe('foo')
    expect(result).toBe('foo')

    state.value = 'bar'
    expect(result).toBe('bar')
    expect(state.value).toBe('bar')

    watcher.destroy()

    state.value = 'baz'

    expect(state.value).toBe('baz')
    expect(result).toBe('bar')

    state.value = 'foo'

    expect(state.value).toBe('foo')
    expect(result).toBe('bar')
  })
  test('condition', () => {
    let count1 = 0
    let count2 = 0
    const run = new State(true)
    const state = new State('foo')
    let result
    new Watch(() => {
      count1++
      if (run.value) {
        count2++
        result = state.value
      }
    })
    expect(result).toBe('foo')
    expect(state.value).toBe('foo')
    expect(count1).toBe(1)
    expect(count2).toBe(1)
    expect(run.value).toBe(true)

    state.value = 'bar'

    expect(result).toBe('bar')
    expect(state.value).toBe('bar')
    expect(count1).toBe(2)
    expect(count2).toBe(2)
    expect(run.value).toBe(true)

    run.value = false

    expect(result).toBe('bar')
    expect(state.value).toBe('bar')
    expect(count1).toBe(3)
    expect(count2).toBe(2)
    expect(run.value).toBe(false)

    state.value = 'baz'

    expect(result).toBe('bar')
    expect(state.value).toBe('baz')
    expect(count1).toBe(3)
    expect(count2).toBe(2)
    expect(run.value).toBe(false)
  })
  test('useless rendering with the same state', () => {
    let count = 0
    const state = new State('foo')

    new Watch(() => {
      state.value
      count++
    })
    expect(count).toBe(1)

    state.value = 'foo'
    expect(count).toBe(1)
  })
  test('set state in watch', () => {
    let count = 0
    const state1 = new State('foo')
    const state2 = new State('')
    new Watch(() => {
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
  describe('deep', () => {
    test('auto-remove', () => {
      let count = 0
      const run = new State(true)
      const state = new State('foo')
      let result
      new Watch(() => {
        count++
        if (run.value) {
          new Watch(() => result = state.value)
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
    test('double value', () => {
      const state = new State()
      let render1 = []
      let render2 = []

      new Watch(() => {
        render1.push([state.value, state.value])
        new Watch(() => {
          render2.push([state.value, state.value])
        })
      })
      expect(render1.length).toBe(1)
      expect(render2.length).toBe(1)
      expect(render1[0]).toEqual([undefined, undefined])
      expect(render2[0]).toEqual([undefined, undefined])

      state.value = true
      expect(render1.length).toBe(2)
      expect(render2.length).toBe(2)
      expect(render1[1]).toEqual([true, true])
      expect(render2[1]).toEqual([true, true])
    })
  })
  describe('computed Watch', () => {
    test('simple', () => {
      const name = new State('Mike')
      const surname = new State('Deight')
      const fullName = new Watch(() => `${name.value} ${surname.value[0]}.`)

      expect(fullName.value).toBe('Mike D.')

      surname.value = 'Mighty'
      expect(fullName.value).toBe('Mike M.')
    })
  })
})