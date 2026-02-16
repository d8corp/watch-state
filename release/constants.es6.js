/** Global singleton tracking active watcher and event depth */
const scope = {
    activeWatcher: undefined,
    eventDeep: 0,
};

export { scope };
