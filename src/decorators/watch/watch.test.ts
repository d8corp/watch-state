import {state, event, cache, watch} from '/'

describe('watch', () => {
  test('simple', () => {
    let logger = []

    class Test {
      @state value = 0
      @watch log () {
        logger.push(this.value)
      }
    }

    const test = new Test()

    expect(test.value).toBe(0)
    expect(logger.length).toBe(0)

    test.log()

    expect(logger.length).toBe(1)
    expect(logger[0]).toBe(0)

    test.value = 1
    expect(logger.length).toBe(2)
    expect(logger[1]).toBe(1)
  })
  test('combine', () => {
    const log = []
    class Counter {
      @state value = 1
      @event tick () {
        this.value++
      }
      @cache get square () {
        return this.value ** 2
      }
      @watch run () {
        log.push([this.value, this.square])
      }
    }

    const counter = new Counter()
    expect(log.length).toBe(0)

    counter.run()
    expect(log.length).toBe(1)
    expect(log[0]).toEqual([1, 1])

    counter.tick()
    expect(log.length).toBe(2)
    expect(log[1]).toEqual([2, 4])
  })
  test('combine non-event', () => {
    const log = []
    class Counter {
      @state value = 1
      tick () {
        this.value++
      }
      @cache get square () {
        return this.value ** 2
      }
      @watch run () {
        log.push([this.value, this.square])
      }
    }

    const counter = new Counter()
    expect(log.length).toBe(0)

    counter.run()
    expect(log).toEqual([[1, 1]])

    counter.tick()
    expect(log).toEqual([[1, 1], [2, 4]])
  })
})
