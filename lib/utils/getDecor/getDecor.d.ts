import State from '../../classes/State';
import Cache from '../../classes/Cache';
import Mixer from '../../classes/Mixer';
interface Types<V = any> {
    state: State<V>;
    mixer: Mixer<V>;
    cache: Cache<V>;
}
/** @deprecated - use getState or getCache or getMixer from @watch-state/mixer */
declare function getDecor<TT extends keyof Types, T extends object>(target: T, property: keyof T): Types<T[typeof property]>[TT];
export default getDecor;
export { getDecor };
