import { callEvent, State, Watch } from '../..'

describe('callEvent', () => {
  it('batches multiple state updates into single watcher notification', () => {
    const log = jest.fn()
    const a = new State(0)
    const b = new State(0)

    new Watch(() => {
      log(a.value, b.value)
    })

    expect(log).toHaveBeenCalledTimes(1)

    callEvent(() => {
      a.value = 1
      b.value = 1
    })

    expect(log).toHaveBeenCalledTimes(2)
  })
})
