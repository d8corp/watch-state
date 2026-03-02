import { Observable } from './Observable'

import { Watch } from '..'

describe('Observable', () => {
  describe('value getter', () => {
    it('has the value getter', () => {
      class NumberState extends Observable<number> {
        raw = 0
      }
      const state = new NumberState()
      expect('value' in state).toBe(true)
    })

    it('auto-subscribes active watcher', () => {
      class NumberState extends Observable<number> {
        raw = 0
      }

      const state = new NumberState()
      const log: number[] = []

      new Watch(() => {
        log.push(state.value)
      })

      expect(log).toEqual([0])

      state.raw = 1

      state.update()
      expect(log).toEqual([0, 1])

      state.update()
      expect(log).toEqual([0, 1, 1])
    })
  })

  describe('get method', () => {
    it('has the get method', () => {
      class NumberState extends Observable<number> {
        raw = 0
      }
      const state = new NumberState()
      expect('get' in state).toBe(true)
    })
  })

  describe('update method', () => {
    it('has the update method', () => {
      class NumberState extends Observable<number> {
        raw = 0
      }
      const state = new NumberState()
      expect('update' in state).toBe(true)
    })
  })

  describe('raw field', () => {
    it('has the raw field', () => {
      class NumberState extends Observable<number> {
        raw = 0
      }
      const state = new NumberState()
      expect('raw' in state).toBe(true)
    })
  })

  describe('on method', () => {
    it('has the on method', () => {
      class NumberState extends Observable<number> {
        raw = 0
      }
      const state = new NumberState()
      expect('on' in state).toBe(true)
    })
  })

  describe('off method', () => {
    it('has the off method', () => {
      class NumberState extends Observable<number> {
        raw = 0
      }
      const state = new NumberState()
      expect('off' in state).toBe(true)
    })
  })

  describe('reactions field', () => {
    it('has the reactions field', () => {
      class NumberState extends Observable<number> {
        raw = 0
      }
      const state = new NumberState()
      expect('reactions' in state).toBe(true)
    })
  })
})
