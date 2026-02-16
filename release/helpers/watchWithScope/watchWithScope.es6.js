import { scope } from '../../constants.es6.js';

function watchWithScope(observer, target) {
    const prevObserver = scope.activeWatcher;
    scope.activeWatcher = observer;
    target();
    scope.activeWatcher = prevObserver;
}

export { watchWithScope };
