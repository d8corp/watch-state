import Watch from '../Watch';
import State from '../State';
declare class Mixed<T = any> {
    protected target: () => T;
    state: State<T>;
    watcher: Watch;
    private newValue?;
    constructor(target: () => T);
    destructor(): void;
    checkWatcher(): void;
    get value(): T;
}
export default Mixed;
export { Mixed, };
