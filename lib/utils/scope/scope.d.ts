import Watch from '../../classes/Watch';
interface Scope {
    activeWatcher?: Watch;
    activeWatchers?: Set<Watch>;
}
declare const scope: Scope;
export default scope;
export { scope, Scope, };
