import { watchWithScope } from './watchWithScope'

import { State } from '../../State'
import { Watch } from '../../Watch'

describe('watchWithScope', () => {
  it('executes target function', () => {
    const log: number[] = []
    const state = new State(0)

    const watcher = new Watch(() => {
      log.push(state.raw)
    })

    watchWithScope(watcher, () => state.get())

    expect(log).toEqual([0])

    state.value++

    expect(log).toEqual([0, 1])

    state.value++

    expect(log).toEqual([0, 1])
  })
})
