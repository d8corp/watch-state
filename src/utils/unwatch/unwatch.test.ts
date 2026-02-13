import { State, unwatch, Watch } from '../..'

describe('unwatch', () => {
  it('works', () => {
    const log = jest.fn()
    const count = new State(0)

    new Watch(() => {
      log(unwatch(() => count.value++))
    })

    expect(log).toHaveBeenCalledTimes(1)
    expect(log).toHaveBeenLastCalledWith(0)
    expect(count.value).toBe(1)

    count.value++

    expect(log).toHaveBeenCalledTimes(1)
    expect(count.value).toBe(2)

    count.value++

    expect(log).toHaveBeenCalledTimes(1)
    expect(count.value).toBe(3)
  })
})
