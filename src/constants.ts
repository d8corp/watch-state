import type { Scope } from './types'

/** Global singleton tracking active watcher and event depth */
export const scope: Scope = {
  activeWatcher: undefined,
}
