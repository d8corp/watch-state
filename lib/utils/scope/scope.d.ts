import Watch from '../../classes/Watch';
import Cache from '../../classes/Cache';
interface Scope {
    activeWatcher?: Watch;
    eventWatchers?: Set<Watch>;
    activeCache?: Cache;
}
declare const scope: Scope;
export default scope;
export { scope, Scope, };
