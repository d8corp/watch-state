import Watch from '../../classes/Watch'
import Cache from '../../classes/Cache'

interface Scope {
  activeWatcher?: Watch
  activeWatchers?: Set<Watch>
  activeCache?: Cache
}

const scope: Scope = {}


export default scope

export {
  scope,
  Scope,
}
