import Watch, {Destructor} from 'src/classes/Watch'

function onDestroy (callback: Destructor): boolean {
  if (Watch.activeWatcher) {
    Watch.activeWatcher.onDestroy(callback)
    return true
  }
  return false
}

export default onDestroy

export {
  onDestroy,
}
