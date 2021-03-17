import scope from '../scope/scope.es6.js';

function reset() {
    scope.eventWatchers = scope.activeWatcher = undefined;
}

export default reset;
export { reset };
