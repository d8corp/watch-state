import { createEvent, State, Watch } from '../..'

describe('createEvent', () => {
  it('works', () => {
    const log = jest.fn()
    const count = new State(0)
    const increase = createEvent(() => {
      log(count.value++)
    })

    new Watch(increase)

    expect(log).toHaveBeenCalledTimes(1)
    expect(log).toHaveBeenLastCalledWith(0)
    expect(count.value).toBe(1)

    count.value++

    expect(log).toHaveBeenCalledTimes(1)
    expect(count.value).toBe(2)

    increase()

    expect(log).toHaveBeenCalledTimes(2)
    expect(log).toHaveBeenLastCalledWith(2)
    expect(count.value).toBe(3)
  })
})
