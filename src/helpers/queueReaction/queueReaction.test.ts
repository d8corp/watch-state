import { queueReaction } from './queueReaction'

describe('queueReaction', () => {
  it('executes reaction immediately when not working', () => {
    const log: number[] = []

    queueReaction(() => {
      log.push(1)
    })

    expect(log).toEqual([1])
  })

  it('queues reaction when already working', () => {
    const log: number[] = []

    queueReaction(() => {
      log.push(1)

      queueReaction(() => {
        log.push(2)
      })
    })

    expect(log).toEqual([1, 2])
  })

  it('executes multiple queued reactions', () => {
    const log: number[] = []

    queueReaction(() => {
      log.push(1)

      queueReaction(() => {
        log.push(2)

        queueReaction(() => {
          log.push(3)
        })
      })
    })

    expect(log).toEqual([1, 2, 3])
  })

  it('executes reactions in LIFO order from queue', () => {
    const log: number[] = []

    queueReaction(() => {
      log.push(1)

      queueReaction(() => {
        log.push(2)
      })

      queueReaction(() => {
        log.push(3)
      })
    })

    expect(log).toEqual([1, 3, 2])
  })
})
