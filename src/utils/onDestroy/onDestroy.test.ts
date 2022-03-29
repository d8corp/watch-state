import { onDestroy, State, Watch } from '../..'

describe('onDestroy', () => {
  it('works', () => {
    const log = jest.fn()
    const state = new State(0)

    const watcher = new Watch(() => {
      log(state.value)
      onDestroy(() => log('destroy'))
    })

    expect(log).toBeCalledTimes(1)
    expect(log).toHaveBeenLastCalledWith(0)

    state.value = 1

    expect(log).toBeCalledTimes(3)
    expect(log).toHaveBeenLastCalledWith(1)

    watcher.destroy()

    expect(log).toBeCalledTimes(4)
    expect(log).toHaveBeenLastCalledWith('destroy')

    watcher.destroy()

    expect(log).toBeCalledTimes(4)
    expect(log).toHaveBeenLastCalledWith('destroy')
  })
})
