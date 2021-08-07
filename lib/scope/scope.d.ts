import { Watch, Event } from '..';
export interface Scope {
    activeWatcher?: Watch;
    activeEvent?: Event;
    activeEventDeep: number;
}
export declare const scope: Scope;
