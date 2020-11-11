import scope from '../scope/scope.es6.js';

function onDestructor(callback) {
    if (scope.activeWatcher) {
        scope.activeWatcher.onDestructor(callback);
        return true;
    }
    return false;
}

export default onDestructor;
export { onDestructor };
