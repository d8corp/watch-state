import { scope } from '../../constants.es6.js';

function bindObserver(observer) {
    const { activeWatcher } = scope;
    if (activeWatcher) {
        activeWatcher.childrenObservers.add(observer);
        activeWatcher.destructors.add(() => {
            activeWatcher.childrenObservers.delete(observer);
        });
    }
}

export { bindObserver };
