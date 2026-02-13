import { Compute } from './Compute'

import { State, Watch } from '..'

describe('Compute', () => {
  describe('constructor', () => {
    test('empty watcher without error', () => {
      expect(() => new Compute(() => {})).not.toThrow()
    })

    test('value watcher without error', () => {
      expect(() => new Compute(() => 1)).not.toThrow()
    })

    test('instance of Compute', () => {
      expect(new Compute(() => {})).toBeInstanceOf(Compute)
    })
  })

  describe('fields', () => {
    describe('value', () => {
      let test = 0
      const compute = new Compute(() => test++)

      expect(test).toBe(0)
      expect(compute.value).toBe(0)
      expect(test).toBe(1)

      expect(compute.value).toBe(0)
      expect(test).toBe(1)
    })
  })

  describe('methods', () => {
    describe('destroy', () => {
      it('has the method', () => {
        const compute = new Compute(() => {})
        expect('destroy' in compute).toBe(true)
        expect(typeof compute.destroy).toBe('function')
      })

      it('works', () => {
        let test = 0
        const state = new State(0)

        const compute = new Compute(() => {
          test++

          return state.value
        })

        new Watch(() => compute.value)

        expect(test).toBe(1)

        state.value++
        expect(test).toBe(2)

        state.value++
        expect(test).toBe(3)

        compute.destroy()
        state.value++
        expect(test).toBe(3)
      })
    })

    describe('update', () => {
      it('has the method', () => {
        const compute = new Compute(() => {})
        expect('update' in compute).toBe(true)
        expect(typeof compute.update).toBe('function')
      })

      it('runs target', () => {
        let test = 0
        const compute = new Compute(() => test++)

        expect(test).toBe(0)

        compute.update()
        expect(test).toBe(0)
        expect(compute.value).toBe(0)
        expect(test).toBe(1)

        compute.update()
        expect(test).toBe(1)
        expect(compute.value).toBe(1)
        expect(test).toBe(2)
      })
    })
  })

  test('deep Compute destroy', () => {
    let test1 = 0
    let test2 = 0

    let compute1: Compute

    const compute2 = new Compute(() => {
      test1++
      compute1 = new Compute(() => test2++, false, true)
    }, true, true)

    const watcherTest = compute1
    expect(test1).toBe(1)
    expect(test2).toBe(1)
    expect(watcherTest).toBe(compute1)

    compute1.update()
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    compute1.value
    expect(test1).toBe(1)
    expect(test2).toBe(2)
    expect(watcherTest).toBe(compute1)

    compute2.update()
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    compute2.value
    expect(test1).toBe(2)
    expect(test2).toBe(3)
    expect(watcherTest).not.toBe(compute1)
  })

  test('deep update', () => {
    const state = new State(0)
    const compute1 = new Compute(() => state.value)
    const compute2 = new Compute(() => compute1.value)

    expect(compute2.value).toBe(0)

    state.value = 1

    expect(compute2.value).toBe(1)
  })

  test('fullName', () => {
    const name = new State('Mike')
    const surname = new State('Deight')
    const fullName = new Compute(() => `${name.value} ${surname.value[0]}.`)
    let result; let count = 0

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
    expect(count).toBe(2)
    expect(result).toBe('Mike M.')
  })

  test('useless run', () => {
    let count = 0
    const name = new State('Mike')
    const surname = new State('Deight')

    const fullName = new Compute(() => {
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
    new Compute(() => {}).destroy()
  })

  test('auto-destroy', () => {
    const log = []
    const state = new State(1)
    const compute = new Compute(() => state.value + 1)

    new Watch(() => {
      if (state.value) {
        new Watch(() => log.push(compute.value))
      }
    })

    expect(log).toEqual([2])

    state.value = 0
    expect(log).toEqual([2])
  })

  test('without watcher', () => {
    const state = new State(true)
    const test = new Compute(() => state.value)

    expect(test.value).toBe(true)

    state.value = false

    expect(test.value).toBe(false)
  })

  test('without state', () => {
    let state = 1
    const test = new Compute(() => state)

    expect(test.value).toBe(1)

    state = 2

    expect(test.value).toBe(1)
  })

  test('empty clear', () => {
    const test = new Compute(() => {})

    expect(() => test.update()).not.toThrow()
  })

  test('watch dependency', () => {
    const state = new State(0)
    const compute = new Compute(() => state.value * 2)

    const log = []

    const watcher = new Watch(() => log.push([state.value, compute.value]))

    expect(log).toEqual([[0, 0]])

    state.value = 2

    expect(log).toEqual([[0, 0], [2, 4]])

    watcher.destroy()
  })

  test('destroy out Compute with Compute', () => {
    const fn = jest.fn()
    const state = new State(true)
    const compute1 = new Compute(() => state.value)
    const compute2 = new Compute(() => state.value)

    new Watch(() => {
      if (compute1.value) {
        new Watch(() => fn(compute2.value))
      }
    })

    expect(fn).toHaveBeenCalledTimes(1)

    state.value = false

    expect(fn).toHaveBeenCalledTimes(1)

    state.value = true

    expect(fn).toHaveBeenCalledTimes(2)
  })

  test('destroy out Compute', () => {
    const state = new State(true)
    const compute = new Compute(() => state.value)
    const fn = jest.fn()

    new Watch(() => {
      if (compute.value) {
        new Watch(() => fn(state.value))
      }
    })

    expect(fn).toHaveBeenCalledTimes(1)

    state.value = false

    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('Compute in Watcher', () => {
    const state = new State(0)
    const run = new State(true)
    const fn = jest.fn()
    const fn1 = jest.fn()

    new Watch(() => {
      if (run.value) {
        const square = new Compute(() => state.value * 2)
        fn1()
        new Watch(() => fn(square.value))
      }
    })

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn1).toHaveBeenCalledTimes(1)

    state.value++

    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn1).toHaveBeenCalledTimes(1)

    run.value = false

    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn1).toHaveBeenCalledTimes(1)

    state.value++

    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn1).toHaveBeenCalledTimes(1)
  })
})
