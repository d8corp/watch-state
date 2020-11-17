import Watch from '../Watch';
import State from '../State';
declare class Cache<T = any> {
    protected target: () => T;
    state: State<T>;
    watcher: Watch;
    constructor(target: () => T);
    destructor(): void;
    checkWatcher(): void;
    get value(): T;
}
export default Cache;
export { Cache, };
