import { State, Watch } from '..'

describe('Watch', () => {
  describe('constructor', () => {
    test('empty watcher without error', () => {
      expect(() => new Watch(() => {})).not.toThrow()
    })
    test('value watcher without error', () => {
      expect(() => new Watch(() => 1)).not.toThrow()
    })
    test('instance of Watch', () => {
      expect(new Watch(() => {})).toBeInstanceOf(Watch)
    })
  })
  describe('update method', () => {
    it('has the method', () => {
      const watcher = new Watch(() => {})
      expect('update' in watcher).toBe(true)
      expect(typeof watcher.update).toBe('function')
    })
    it('runs the watcher', () => {
      let test = 0
      const watcher = new Watch(() => test++)

      expect(test).toBe(1)

      watcher.update()
      expect(test).toBe(2)

      watcher.update()
      expect(test).toBe(3)
    })
    test('deep watcher destroy', () => {
      let test1 = 0
      let test2 = 0
      let watcher2: Watch
      const watcher1 = new Watch(() => {
        test1++
        watcher2 = new Watch(() => test2++)
      })

      let watcherTest = watcher2
      expect(test1).toBe(1)
      expect(test2).toBe(1)
      expect(watcherTest).toBe(watcher2)

      watcher2.update()
      expect(test1).toBe(1)
      expect(test2).toBe(2)
      expect(watcherTest).toBe(watcher2)

      watcher1.update()
      expect(test1).toBe(2)
      expect(test2).toBe(3)
      expect(watcherTest).not.toBe(watcher2)
    })
  })
  describe('destroy method', () => {
    test('has the method', () => {
      const watcher = new Watch(() => {})
      expect('destroy' in watcher).toBe(true)
      expect(typeof watcher.destroy).toBe('function')
    })
    test('deep1', () => {
      let test = 0
      const watcher = new Watch(() => test++)

      expect(test).toBe(1)
      watcher.destroy()
      expect(test).toBe(1)
    })
    test('deep2', () => {
      let test = 0
      const watcher = new Watch(() => new Watch(() => test++))

      expect(test).toBe(1)
      watcher.destroy()
      expect(test).toBe(1)
    })
  })
  describe('onClear', () => {
    describe('method', () => {
      test('without update', () => {
        let test = 0
        const watcher = new Watch(() => {})
        watcher.onClear(() => test++)
        expect(test).toBe(0)
        watcher.destroy()
        expect(test).toBe(1)
        watcher.destroy()
        expect(test).toBe(1)
      })
      test('with update', () => {
        let test = 0
        const watcher = new Watch(() => {})
        watcher.onClear(() => test++)
        watcher.update()
        expect(test).toBe(1)
        watcher.destroy()
        expect(test).toBe(1)
      })
      test('with state', () => {
        const change = jest.fn()
        const destroy = jest.fn()
        const state = new State(0)
        const watcher = new Watch(() => {
          change(state.value)
        }).onClear(destroy)

        expect(destroy).toBeCalledTimes(0)
        expect(change).toBeCalledTimes(1)
        expect(change).toHaveBeenLastCalledWith(0)

        state.value++

        expect(destroy).toBeCalledTimes(1)
        expect(change).toBeCalledTimes(2)
        expect(change).toHaveBeenLastCalledWith(1)

        state.value++

        expect(destroy).toBeCalledTimes(1)
        expect(change).toBeCalledTimes(3)
        expect(change).toHaveBeenLastCalledWith(2)

        watcher.destroy()

        expect(destroy).toBeCalledTimes(1)
        expect(change).toBeCalledTimes(3)
        expect(change).toHaveBeenLastCalledWith(2)
      })
    })
  })
  describe('update argument', () => {
    test('update', () => {
      let updated: boolean
      const watcher = new Watch(update => updated = update)
      expect(updated).toBe(false)
      watcher.update()
      expect(updated).toBe(true)
      watcher.destroy()
      expect(updated).toBe(true)
    })
  })
})
