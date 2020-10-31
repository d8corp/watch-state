import watch, {Watch, onClear, onUpdate, onDestructor} from './Watch'

describe('watch', () => {
  test('returns Watch', () => {
    expect(watch(() => {})).toBeInstanceOf(Watch)
  })
  describe('update', () => {
    test('has the method', () => {
      const watcher = watch(() => {})
      expect('update' in watcher).toBe(true)
      expect(typeof watcher.update).toBe('function')
    })
    test('deep1', () => {
      let test = 0
      const watcher = watch(() => test++)

      expect(test).toBe(1)
      watcher.update()
      expect(test).toBe(2)
      watcher.update()
      expect(test).toBe(3)
    })
    test('deep2', () => {
      let test1 = 0
      let test2 = 0
      let watcher2: Watch
      const watcher1 = watch(() => {
        test1++
        watcher2 = watch(() => test2++)
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
  describe('destructor', () => {
    test('has the method', () => {
      const watcher = watch(() => {})
      expect('destructor' in watcher).toBe(true)
      expect(typeof watcher.destructor).toBe('function')
    })
    test('deep1', () => {
      let test = 0
      const watcher = watch(() => test++)

      expect(test).toBe(1)
      watcher.destructor()
      expect(test).toBe(1)
    })
    test('deep2', () => {
      let test = 0
      const watcher = watch(() => watch(() => test++))

      expect(test).toBe(1)
      watcher.destructor()
      expect(test).toBe(1)
    })
  })
  describe('onDestructor', () => {
    describe('method', () => {
      test('without update', () => {
        let test = 0
        const watcher = watch(() => {})
        watcher.onDestructor(() => test++)
        expect(test).toBe(0)
        watcher.destructor()
        expect(test).toBe(1)
        watcher.destructor()
        expect(test).toBe(1)
      })
      test('with update', () => {
        let test = 0
        const watcher = watch(() => {})
        watcher.onDestructor(() => test++)
        watcher.update()
        expect(test).toBe(0)
        watcher.destructor()
        expect(test).toBe(0)
      })
    })
    describe('function', () => {
      test('deep 1', () => {
        let test = 0
        const watcher = watch(() => onDestructor(() => test++))

        expect(test).toBe(0)
        watcher.update()
        expect(test).toBe(0)
        watcher.destructor()
        expect(test).toBe(1)
      })
      test('deep 2', () => {
        let test1 = 0
        let test2 = 0
        const watcher = watch(() => {
          onDestructor(() => test1++)
          watch(() => onDestructor(() => test2++))
        })

        expect(test1).toBe(0)
        expect(test2).toBe(0)
        watcher.update()
        expect(test1).toBe(0)
        expect(test2).toBe(1)
        watcher.destructor()
        expect(test1).toBe(1)
        expect(test2).toBe(2)
      })
    })
  })
})
