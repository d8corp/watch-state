import scope from '../scope/scope.es6.js';

function unwatch(target) {
    const prevWatcher = scope.activeWatcher;
    scope.activeWatcher = undefined;
    const result = target();
    scope.activeWatcher = prevWatcher;
    return result;
}

export default unwatch;
export { unwatch };
