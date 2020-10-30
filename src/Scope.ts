import {Watch} from './Watch'

interface Scope {
  activeWatcher?: Watch
  actionWatchers?: Set<Watch>
}

const scope: Scope = {}

function reset () {
  scope.actionWatchers = scope.activeWatcher = undefined
}

export default scope

export {
  scope,
  reset,
  Scope,
}
