import scope from './Scope.es6.js';

function reset() {
    scope.actionWatchers = scope.activeWatcher = undefined;
}

export { reset };
