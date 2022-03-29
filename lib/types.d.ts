import { Watch } from './Watch';
import { Event } from './Event';
export interface Watcher<R = any> {
    (update?: boolean): R;
}
export interface Destructor<R = any> {
    (): R;
}
export interface Scope {
    activeWatcher?: Watch;
    activeEvent?: Event;
    activeEventDeep: number;
}
