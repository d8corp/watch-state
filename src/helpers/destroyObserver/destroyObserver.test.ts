import { destroyObserver } from './destroyObserver'

import { batch, State, Watch } from '../../'

describe('destroyObserver', () => {
  it('handles watcher with no destructors', () => {
    const watcher = new Watch(() => {})

    expect(() => destroyObserver(watcher)).not.toThrow()
    expect(watcher.destroyed).toBe(true)
  })

  it('destroys watcher and runs destructors', () => {
    const fn = jest.fn()
    const watcher = new Watch(() => {})

    watcher.destructors.add(fn)

    expect(fn).not.toHaveBeenCalled()
    expect(watcher.destroyed).toBe(false)

    destroyObserver(watcher)

    expect(fn).toHaveBeenCalled()
    expect(watcher.destroyed).toBe(true)
  })

  it('destroys nested watchers recursively', () => {
    const fn = jest.fn()
    let child: Watch

    const parent = new Watch(() => {
      child = new Watch(() => {})
    })

    child!.destructors.add(fn)

    expect(fn).not.toHaveBeenCalled()
    expect(child!.destroyed).toBe(false)

    destroyObserver(parent)

    expect(fn).toHaveBeenCalled()
    expect(child!.destroyed).toBe(true)
  })

  it('destroy watcher in action', () => {
    const log: number[] = []
    const state = new State(0)
    const watcher = new Watch(() => log.push(state.value))

    expect(log).toEqual([0])

    batch(() => {
      destroyObserver(watcher)
      state.value++
    })

    expect(watcher.destroyed).toBe(true)
    expect(log).toEqual([0])
  })

  it('removes watcher in action', () => {
    const log: number[] = []
    const state = new State(0)
    const watcher = new Watch(() => log.push(state.value))

    expect(log).toEqual([0])

    batch(() => {
      state.value++
      destroyObserver(watcher)
    })

    expect(watcher.destroyed).toBe(true)
    expect(log).toEqual([0])
  })

  it('clears destructors after running', () => {
    const watcher = new Watch(() => {})

    watcher.destructors.add(() => {})

    expect(watcher.destructors.size).toBe(1)

    destroyObserver(watcher)

    expect(watcher.destructors.size).toBe(0)
  })

  it('can be called in destructor', () => {
    const watcher = new Watch(() => {})

    watcher.destructors.add(() => {
      destroyObserver(watcher)
    })

    expect(watcher.destructors.size).toBe(1)

    destroyObserver(watcher)

    expect(watcher.destructors.size).toBe(0)
  })
})
