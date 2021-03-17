import scope from '../scope/scope.es6.js';

function createEvent(target) {
    return function () {
        if (scope.eventWatchers) {
            return target.apply(this, arguments);
        }
        else {
            const { activeWatcher } = scope;
            scope.activeWatcher = undefined;
            const watchers = scope.eventWatchers = new Set();
            const result = target.apply(this, arguments);
            scope.eventWatchers = undefined;
            watchers.forEach(watcher => watcher.update());
            scope.activeWatcher = activeWatcher;
            return result;
        }
    };
}

export default createEvent;
export { createEvent };
