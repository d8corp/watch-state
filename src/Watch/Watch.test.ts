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

  describe('freeParent option', () => {
    test('child created with freeParent = true is not bound to parent', () => {
      const log: number[] = []
      const s = new State(0)
      let child: Watch | undefined

      const parent = new Watch(() => {
        // Create a child watcher that is not bound to the parent
        child = new Watch(() => {
          log.push(s.value)
        }, true) // freeParent
      })

      // Initial run should have executed and logged the initial value 0
      expect(log).toEqual([0])

      // Change the observed state and ensure child reacts
      s.value = 1
      expect(log).toEqual([0, 1])

      // Destroy parent. Child should still be alive and react to further changes
      parent.destroy()
      s.value = 2
      expect(log).toEqual([0, 1, 2])

      // Destroy child explicitly and ensure it doesn't react anymore
      child?.destroy()
      expect(child?.destroyed).toBe(true)
      s.value = 3
      // No new log entries expected after destruction
      expect(log).toEqual([0, 1, 2])
    })
  })

  describe('freeUpdate option', () => {
    test('watcher with freeUpdate = true does not run initially', () => {
      const log: number[] = []

      new Watch(() => {
        log.push(1)
      }, false, true)

      expect(log).toEqual([])
    })

    test('watcher with freeUpdate = true can be manually initialized', () => {
      const log: number[] = []

      const watcher = new Watch(() => {
        log.push(1)
      }, false, true)

      expect(log).toEqual([])

      watcher.init()
      expect(log).toEqual([1])
    })

    test('init on already initialized watcher does nothing', () => {
      const log: number[] = []

      const watcher = new Watch(() => {
        log.push(1)
      })

      expect(log).toEqual([1])

      // Call init again on already initialized watcher
      watcher.init()

      // Should not run again
      expect(log).toEqual([1])
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
      let watcher2: Watch | undefined

      const watcher1 = new Watch(() => {
        test1++
        watcher2 = new Watch(() => test2++)
      })

      const watcherTest = watcher2
      expect(test1).toBe(1)
      expect(test2).toBe(1)
      expect(watcherTest).toBe(watcher2)

      watcher2?.update()
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

    it('does not call on destroyed', () => {
      let test = 0
      const watcher = new Watch(() => test++)

      expect(test).toBe(1)
      watcher.destroy()
      expect(test).toBe(1)
    })

    it('does not update after destroy', () => {
      const state = new State(0)
      let runs = 0

      const watcher = new Watch(() => {
        runs++

        state.get()
      })

      // initial run
      expect(runs).toBe(1)

      // destroy watcher
      watcher.destroy()

      // mutate state after destroy; should not trigger watcher
      state.value = 1
      expect(runs).toBe(1)

      // calling update should be a no-op as well
      watcher.update()
      expect(runs).toBe(1)
    })

    it('can destroy on destroyed', () => {
      let test = 0
      const watcher = new Watch(() => test++)

      expect(test).toBe(1)
      watcher.destroy()
      expect(test).toBe(1)
      watcher.destroy()
    })
  })

  describe('children field', () => {
    it('has the children', () => {
      const watcher = new Watch(() => {})
      expect('children' in watcher).toBe(true)
      expect(watcher.children).toBeInstanceOf(Set)
    })

    it('adds child Watch to active watcher children set', () => {
      let child: any

      const parent = new Watch(() => {
        child = new Watch(() => {})
      })

      expect(parent.children.size).toBe(1)
      expect(parent.children.has(child)).toBe(true)
    })

    it('removes child from parent children on parent destroy', () => {
      let child: any

      const parent = new Watch(() => {
        child = new Watch(() => {})
      })

      parent.destroy()

      expect(parent.children.has(child)).toBe(false)
    })
  })

  describe('destructors field', () => {
    it('has the destructors', () => {
      const watcher = new Watch(() => {})
      expect('destructors' in watcher).toBe(true)
      expect(watcher.destructors).toBeInstanceOf(Set)
    })

    it('adds destructor to parent to remove child on destroy', () => {
      const log: number[] = []
      const state = new State(0)

      const watcher = new Watch(() => {
        log.push(state.value)
      })

      expect(log).toEqual([0])
      expect(watcher.destructors.size).toBe(1)
      expect(state.reactions.size).toBe(1)

      watcher.destroy()

      expect(log).toEqual([0])
      expect(watcher.destructors.size).toBe(0)
      expect(state.reactions.size).toBe(0)

      state.value++

      expect(log).toEqual([0])
      expect(watcher.destructors.size).toBe(0)
      expect(state.reactions.size).toBe(0)

      watcher.init()

      expect(log).toEqual([0, 1])
      expect(watcher.destructors.size).toBe(1)
      expect(state.reactions.size).toBe(1)

      state.value++

      expect(log).toEqual([0, 1, 2])
      expect(watcher.destructors.size).toBe(1)
      expect(state.reactions.size).toBe(1)
    })
  })
})
