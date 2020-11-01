import { Watch } from './Watch';
interface Scope {
    activeWatcher?: Watch;
    actionWatchers?: Set<Watch>;
}
declare const scope: Scope;
export default scope;
export { scope, Scope, };
