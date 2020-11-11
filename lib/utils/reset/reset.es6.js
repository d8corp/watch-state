import scope from '../scope/scope.es6.js';

function reset() {
    scope.activeWatchers = scope.activeWatcher = undefined;
}

export default reset;
export { reset };
