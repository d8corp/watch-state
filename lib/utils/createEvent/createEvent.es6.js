import scope from '../scope/scope.es6.js';

function createEvent(target) {
    return function () {
        if (scope.activeWatchers) {
            return target.apply(this, arguments);
        }
        else {
            const watchers = scope.activeWatchers = new Set();
            const result = target.apply(this, arguments);
            scope.activeWatchers = undefined;
            watchers.forEach(watcher => watcher.update());
            return result;
        }
    };
}

export default createEvent;
export { createEvent };
