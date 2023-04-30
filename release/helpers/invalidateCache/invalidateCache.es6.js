const invalidateStack = [];
let currentObserver;
function invalidateCache(cache) {
    const skipLoop = Boolean(invalidateStack.length);
    invalidateStack.push(cache);
    if (skipLoop)
        return;
    while ((currentObserver = invalidateStack.shift())) {
        if (currentObserver.isCache) {
            invalidateStack.push(...currentObserver.observers);
            currentObserver.invalid = true;
        }
    }
}

export { invalidateCache };
