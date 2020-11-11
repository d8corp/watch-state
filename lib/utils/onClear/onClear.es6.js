import scope from '../scope/scope.es6.js';

function onClear(callback) {
    if (scope.activeWatcher) {
        scope.activeWatcher.onClear(callback);
        return true;
    }
    return false;
}

export default onClear;
export { onClear };
