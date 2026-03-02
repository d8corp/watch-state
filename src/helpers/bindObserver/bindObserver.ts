import type { Observer } from '../../types'

export function bindObserver (parent: Observer, observer: Observer) {
  parent.children.add(observer)

  parent.destructors.push(() => {
    parent.children.delete(observer)
  })
}
