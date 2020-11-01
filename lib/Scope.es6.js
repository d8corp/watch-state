const scope = {};
function reset() {
    scope.actionWatchers = scope.activeWatcher = undefined;
}

export default scope;
export { reset, scope };
