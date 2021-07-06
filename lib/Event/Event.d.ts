import Watch from '../Watch';
import Cache from '../Cache';
export declare class Event {
    watchers: Set<Watch | Cache>;
    activeWatchers: Set<Watch | Cache>;
    activeWatcher: Watch;
    add(target: Watch | Cache): void;
    start(): void;
    end(): void;
    update(): void;
}
export default Event;
