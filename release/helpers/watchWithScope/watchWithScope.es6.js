import { scope } from '../../constants.es6.js';

function watchWithScope(watcher, target) {
    const prevWatcher = scope.activeWatcher;
    scope.activeWatcher = watcher;
    target();
    scope.activeWatcher = prevWatcher;
}

export { watchWithScope };
