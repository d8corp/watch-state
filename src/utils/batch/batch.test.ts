import { batch } from './batch'

import { Compute } from '../../Compute'
import { State } from '../../State'
import { Watch } from '../../Watch'

describe('batch', () => {
  describe('inner cases', () => {
    describe('function execution', () => {
      it('executes function immediately when not working', () => {
        const log: number[] = []

        batch(() => {
          log.push(1)
        })

        expect(log).toEqual([1])
      })

      it('executes nested functions in queue', () => {
        const log: number[] = []

        batch(() => {
          log.push(1)

          batch(() => {
            log.push(2)
          })
        })

        expect(log).toEqual([1, 2])
      })
    })
  })

  describe('with watcher', () => {
    it('should update watcher', () => {
      let log = 0
      const watcher = new Watch(() => log++)

      expect(log).toBe(1)

      batch(watcher)
      expect(log).toBe(2)
    })
  })

  describe('batching', () => {
    it('batches state with watcher', () => {
      const log: number[][] = []
      const positive = new State(1)
      const negative = new State(-1)

      new Watch(() => {
        log.push([positive.value, negative.value])
      })

      expect(log).toEqual([[1, -1]])

      batch(() => {
        positive.value++
        negative.value--
      })

      expect(log).toEqual([[1, -1], [2, -2]])
    })

    it('batches state with compute', () => {
      const log: number[][] = []
      const positive = new State(1)
      const negative = new State(-1)

      const compute = new Compute(() => {
        log.push([positive.value, negative.value])
      })

      new Watch(() => compute.value)

      expect(log).toEqual([[1, -1]])

      batch(() => {
        positive.value++
        negative.value--
      })

      expect(log).toEqual([[1, -1], [2, -2]])
    })

    it('changes value inside action', () => {
      const log: number[] = []
      const count = new State(0)

      new Watch(() => {
        log.push(count.value)
      })

      expect(log).toEqual([0])

      batch(() => {
        count.set(count.raw + 1)
        count.set(count.raw + 1)
      })

      expect(log).toEqual([0, 2])

      batch(() => {
        count.value++
        count.value++
      })

      expect(log).toEqual([0, 2, 4])
    })

    it('calls subscriptions once per a batching', () => {
      const log: number[] = []
      const count = new State(0)

      count.on(() => {
        log.push(count.value)
      })

      expect(log).toEqual([])

      batch(() => {
        count.set(count.raw + 1)
        count.set(count.raw + 1)
      })

      expect(log).toEqual([2])

      batch(() => {
        count.value++
        count.value++
      })

      expect(log).toEqual([2, 4])
    })
  })
})
