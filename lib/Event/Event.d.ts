import Watch from 'src/Watch';
import Cache from 'src/Cache';
export declare class Event {
    watchers: Set<Watch | Cache>;
    activeWatchers: Set<Watch | Cache>;
    add(target: Watch | Cache): void;
    start(): void;
    end(): void;
    pipe(watcher: Watch | Cache): void;
    update(): void;
}
export default Event;
