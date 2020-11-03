import scope from './Scope.es6.js';

function action(target, propertyKey, descriptor) {
    if (typeof target === 'function') {
        return function () {
            if (scope.actionWatchers) {
                return target.apply(this, arguments);
            }
            else {
                const watchers = scope.actionWatchers = new Set();
                const result = target.apply(this, arguments);
                scope.actionWatchers = undefined;
                watchers.forEach(watcher => watcher.update());
                return result;
            }
        };
    }
    else {
        return Object.assign({}, descriptor, {
            value: action(descriptor.value)
        });
    }
}

export default action;
export { action };
