import { scope } from '../constants'
import { bindObserver } from '../helpers/bindObserver'
import { clearWatcher } from '../helpers/clearWatcher'
import { destroyWatchers } from '../helpers/destroyWatchers'
import { watchWithScope } from '../helpers/watchWithScope'
import { Observable } from '../Observable'
import type { Destructor, Observer, Watcher } from '../types'
import { shiftSet } from '../utils/shiftSet'

/* queue */

let currentCompute: Compute
let currentObserver: Observer
let forcedQueue: boolean

const computeStack = new Set<Compute>()
const observersStack = new Set<Observer>()

export function forceQueueWatchers () {
  if (forcedQueue) return
  forcedQueue = true

  while ((currentCompute = shiftSet(computeStack)) || (currentObserver = shiftSet(observersStack))) {
    if (currentCompute) {
      currentCompute.invalid = true
      continue
    }

    clearWatcher(currentObserver)

    currentObserver.update()
  }

  forcedQueue = false
}

export function queueWatchers (watchers: Set<Observer>) {
  const useLoop = !scope.eventDeep && !observersStack.size && !computeStack.size
  const oldObserversStack = [...observersStack]

  observersStack.clear()

  watchers.forEach(watcher => {
    observersStack.add(watcher)

    if (watcher instanceof Compute) {
      computeStack.add(watcher)
    }
  })

  oldObserversStack.forEach(observer => observersStack.add(observer))

  if (useLoop) {
    forceQueueWatchers()
  }
}

/* invalidateCompute */

const invalidateStack: Observer[] = []
let currentInvalidateObserver: Observer

export function invalidateCompute (cache: Observer) {
  const skipLoop = invalidateStack.length
  invalidateStack.push(cache)

  if (skipLoop) return

  while ((currentInvalidateObserver = invalidateStack.shift())) {
    if (currentInvalidateObserver instanceof Compute) {
      invalidateStack.push(...currentInvalidateObserver.observers)

      currentInvalidateObserver.invalid = true
    }
  }
}

/* Compute */

export class Compute<V = unknown> extends Observable<V> implements Observer {
  invalid = true
  updated = false
  destroyed = false
  // TODO: remove in major version
  isCache = true

  destructors = new Set<Destructor>()
  childWatchers = new Set<Observer>()

  readonly watcher: Watcher<V>
  constructor (watcher: Watcher<V>, freeParent?: boolean, fireImmediately?: boolean) {
    super()
    this.watcher = watcher

    if (!freeParent) {
      bindObserver(this)
    }

    if (fireImmediately) {
      this.forceUpdate()
    }
  }

  update () {
    invalidateCompute(this)

    const parents = [...this.observers]
    let parent: Observer

    while ((parent = parents.pop())) {
      if (!(parent instanceof Compute)) {
        return this.forceUpdate()
      }

      parents.push(...parent.observers)
    }
  }

  forceUpdate () {
    if (!this.destroyed) {
      this.invalid = false

      watchWithScope(this, () => {
        const newValue = this.watcher(this.updated ? this.updated = true : false)

        if (newValue !== this.rawValue) {
          this.rawValue = newValue
          queueWatchers(this.observers)
        }
      })
    }
  }

  get value () {
    if (this.invalid) {
      this.forceUpdate()
    }

    return this.destroyed ? this.rawValue : super.value
  }

  destroy () {
    destroyWatchers(this)
  }
}
