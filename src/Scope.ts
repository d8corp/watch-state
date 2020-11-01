import {Watch} from './Watch'

interface Scope {
  activeWatcher?: Watch
  actionWatchers?: Set<Watch>
}

const scope: Scope = {}


export default scope

export {
  scope,
  Scope,
}
