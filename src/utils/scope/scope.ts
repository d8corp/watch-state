import Watch from '/classes/Watch'

interface Scope {
  activeWatcher?: Watch
  eventWatchers?: Set<Watch>
}

const scope: Scope = {}


export default scope

export {
  scope,
  Scope,
}
