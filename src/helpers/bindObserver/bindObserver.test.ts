import { bindObserver } from './bindObserver'

import { Watch } from '../../Watch'

describe('bindObserver', () => {
  it('binds parent watcher to a children watcher', () => {
    let log = 0

    const parent = new Watch(() => {})
    const child = new Watch(() => {})

    child.destructors.add(() => {
      log++
    })

    bindObserver(parent, child)

    expect(log).toBe(0)
    expect(child.destroyed).toBe(false)

    parent.destroy()

    expect(log).toBe(1)
    expect(child.destroyed).toBe(true)
  })
})
