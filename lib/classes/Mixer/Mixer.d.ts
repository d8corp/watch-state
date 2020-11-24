import Watch from '../Watch';
import State from '../State';
declare class Mixer<T = any> {
    protected target: () => T;
    state: State<T>;
    watcher: Watch;
    constructor(target: () => T);
    destructor(): void;
    checkWatcher(): void;
    get value(): T;
}
export default Mixer;
export { Mixer, };
