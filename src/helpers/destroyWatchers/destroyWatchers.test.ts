import { destroyWatchers } from './destroyWatchers'

import { batch, State, Watch } from '../../'

describe('destroyWatchers', () => {
  it('handles watcher with no destructors', () => {
    const watcher = new Watch(() => {})

    expect(() => destroyWatchers(watcher)).not.toThrow()
    expect(watcher.destroyed).toBe(true)
  })

  it('destroys watcher and runs destructors', () => {
    const fn = jest.fn()
    const watcher = new Watch(() => {})

    watcher.destructors.add(fn)

    expect(fn).not.toHaveBeenCalled()
    expect(watcher.destroyed).toBe(false)

    destroyWatchers(watcher)

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

    destroyWatchers(parent)

    expect(fn).toHaveBeenCalled()
    expect(child!.destroyed).toBe(true)
  })

  it('destroy watcher in action', () => {
    const log: number[] = []
    const state = new State(0)
    const watcher = new Watch(() => log.push(state.value))

    expect(log).toEqual([0])

    batch(() => {
      destroyWatchers(watcher)
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
      destroyWatchers(watcher)
    })

    expect(watcher.destroyed).toBe(true)
    expect(log).toEqual([0])
  })

  it('clears destructors after running', () => {
    const watcher = new Watch(() => {})

    watcher.destructors.add(() => {})

    expect(watcher.destructors.size).toBe(1)

    destroyWatchers(watcher)

    expect(watcher.destructors.size).toBe(0)
  })

  it('can be called in destructor', () => {
    const watcher = new Watch(() => {})

    watcher.destructors.add(() => {
      destroyWatchers(watcher)
    })

    expect(watcher.destructors.size).toBe(1)

    destroyWatchers(watcher)

    expect(watcher.destructors.size).toBe(0)
  })
})
