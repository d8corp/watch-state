import {Watch, State, Event, globalEvent} from '..'

describe('Event', () => {
  test('works', () => {
    const log = []
    const count = new State(0)
    const event = new Event()

    new Watch(() => log.push(count.value))

    expect(log.length).toBe(1)
    expect(log[0]).toBe(0)

    event.start()

    count.value++
    count.value++

    event.end()

    expect(log.length).toBe(2)
    expect(log[1]).toBe(2)
  })
  test('event inside event', () => {
    const log = []
    const count = new State(0)
    const event1 = new Event()
    const event2 = new Event()

    new Watch(() => log.push(count.value))

    expect(log.length).toBe(1)
    expect(log[0]).toBe(0)

    event1.start()

    event2.start()
    count.value++
    event2.end()

    count.value++

    expect(log.length).toBe(1)
    event1.end()

    expect(log.length).toBe(2)
    expect(log[1]).toBe(2)
  })
  test('empty event', () => {
    const event = new Event()
    event.start()
    event.end()
  })
  test('event loop', () => {
    const count = new State(0)
    const event = new Event()
    const log = []

    new Watch(() => {
      if (count.value < 5) {
        event.start()
        log.push(count.value++)
        event.end()
      }
    })

    expect(log).toEqual([0, 1, 2, 3, 4])
  })
  test('set in event', () => {
    const count = new State(0)
    const event = new Event()
    const log = []

    new Watch(() => {
      event.start()
      log.push(count.value++)
      event.end()
    })

    expect(log).toEqual([0])
  })
  test('globalEvent', () => {
    const log = []
    const state1 = new State(0)
    const state2 = new State(0)
    const event = new Event()

    new Watch(() => log.push([state1.value, state2.value]))

    expect(log.length).toBe(1)
    expect(log[0]).toEqual([0, 0])

    globalEvent.start()

    state1.value++

    state2.value++

    globalEvent.end()

    expect(log.length).toBe(2)
    expect(log[1]).toEqual([1, 1])
  })
})
