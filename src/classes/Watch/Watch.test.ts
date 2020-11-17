import {Watch, onClear, onDestructor} from '../..'

describe('watch', () => {
  test('returns Watch', () => {
    expect(new Watch(() => {})).toBeInstanceOf(Watch)
  })
  describe('update', () => {
    test('has the method', () => {
      const watcher = new Watch(() => {})
      expect('update' in watcher).toBe(true)
      expect(typeof watcher.update).toBe('function')
    })
    test('deep1', () => {
      let test = 0
      const watcher = new Watch(() => test++)

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
  describe('destructor', () => {
    test('has the method', () => {
      const watcher = new Watch(() => {})
      expect('destructor' in watcher).toBe(true)
      expect(typeof watcher.destructor).toBe('function')
    })
    test('deep1', () => {
      let test = 0
      const watcher = new Watch(() => test++)

      expect(test).toBe(1)
      watcher.destructor()
      expect(test).toBe(1)
    })
    test('deep2', () => {
      let test = 0
      const watcher = new Watch(() => new Watch(() => test++))

      expect(test).toBe(1)
      watcher.destructor()
      expect(test).toBe(1)
    })
  })
  describe('onUpdate', () => {
    describe('method', () => {
      test('without destructor', () => {
        let test = 0
        const watcher = new Watch(() => {})
        watcher.onUpdate(() => test++)
        expect(test).toBe(0)
        watcher.update()
        expect(test).toBe(1)
        watcher.update()
        expect(test).toBe(1)
      })
      test('with destructor', () => {
        let test = 0
        const watcher = new Watch(() => {})
        watcher.onUpdate(() => test++)
        watcher.destructor()
        expect(test).toBe(0)
        watcher.update()
        expect(test).toBe(0)
      })
    })
  })
  describe('onDestructor', () => {
    describe('method', () => {
      test('without update', () => {
        let test = 0
        const watcher = new Watch(() => {})
        watcher.onDestructor(() => test++)
        expect(test).toBe(0)
        watcher.destructor()
        expect(test).toBe(1)
        watcher.destructor()
        expect(test).toBe(1)
      })
      test('with update', () => {
        let test = 0
        const watcher = new Watch(() => {})
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
        const watcher = new Watch(() => onDestructor(() => test++))

        expect(test).toBe(0)
        watcher.update()
        expect(test).toBe(0)
        watcher.destructor()
        expect(test).toBe(1)
      })
      test('deep 2', () => {
        let test1 = 0
        let test2 = 0
        const watcher = new Watch(() => {
          onDestructor(() => test1++)
          new Watch(() => onDestructor(() => test2++))
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
  describe('onClear', () => {
    describe('method', () => {
      test('on update', () => {
        let test = 0
        const watcher = new Watch(() => {})
        watcher.onClear(() => test++)
        expect(test).toBe(0)
        watcher.update()
        expect(test).toBe(1)
        watcher.update()
        expect(test).toBe(1)
      })
      test('on destructor', () => {
        let test = 0
        const watcher = new Watch(() => {})
        watcher.onClear(() => test++)
        expect(test).toBe(0)
        watcher.destructor()
        expect(test).toBe(1)
        watcher.destructor()
        expect(test).toBe(1)
      })
    })
    describe('function', () => {
      test('deep 1', () => {
        let test = 0
        const watcher = new Watch(() => onClear(() => test++))

        expect(test).toBe(0)
        watcher.update()
        expect(test).toBe(1)
        watcher.destructor()
        expect(test).toBe(2)
      })
      test('deep 2', () => {
        let test1 = 0
        let test2 = 0
        const watcher = new Watch(() => {
          onClear(() => test1++)
          new Watch(() => onClear(() => test2++))
        })

        expect(test1).toBe(0)
        expect(test2).toBe(0)
        watcher.update()
        expect(test1).toBe(1)
        expect(test2).toBe(1)
        watcher.destructor()
        expect(test1).toBe(2)
        expect(test2).toBe(2)
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
      watcher.destructor()
      expect(updated).toBe(true)
    })
    test('onClear', () => {
      let updated: boolean
      const watcher = new Watch(() => onClear(update => updated = update))
      expect(updated).toBe(undefined)
      watcher.update()
      expect(updated).toBe(true)
      watcher.destructor()
      expect(updated).toBe(false)
    })
  })
})