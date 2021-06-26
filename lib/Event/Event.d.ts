import Watch from '../Watch';
import Cache from '../Cache';
export declare class Event {
    watchers: Set<Watch | Cache>;
    activeWatchers: Set<Watch | Cache>;
    activeWatcher: Watch;
    add(target: Watch | Cache): void;
    private _start;
    start(): void;
    private _end;
    end(): void;
    pipe(watcher: Watch | Cache): void;
    update(): void;
}
export default Event;
