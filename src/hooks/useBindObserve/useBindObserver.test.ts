import { useBindObserver } from './useBindObserve'

import { Watch } from '../../Watch'

describe('useBindObserver', () => {
  it('binds parent watcher to a children watcher', () => {
    let log = 0

    const child = new Watch(() => {})

    const parent = new Watch(() => {
      useBindObserver(child)
    })

    child.destructors.add(() => {
      log++
    })

    expect(log).toBe(0)
    expect(child.destroyed).toBe(false)

    parent.destroy()

    expect(log).toBe(1)
    expect(child.destroyed).toBe(true)
  })
})
