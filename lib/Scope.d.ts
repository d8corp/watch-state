import { Watch } from './Watch';
interface Scope {
    activeWatcher?: Watch;
    actionWatchers?: Set<Watch>;
}
declare const scope: Scope;
declare function reset(): void;
export default scope;
export { scope, reset, Scope, };
