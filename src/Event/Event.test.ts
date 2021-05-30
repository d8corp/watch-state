import {Watch, State, Event} from 'src'

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
})