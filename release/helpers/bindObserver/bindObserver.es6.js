import { scope } from '../../constants.es6.js';

function bindObserver(observer) {
    const { activeWatcher } = scope;
    if (activeWatcher) {
        activeWatcher.children.add(observer);
        activeWatcher.destructors.add(() => {
            activeWatcher.children.delete(observer);
        });
    }
}

export { bindObserver };
