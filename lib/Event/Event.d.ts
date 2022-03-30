import { Watch } from '../Watch';
import { Cache } from '../Cache';
export declare class Event {
    watchers: Set<Watch | Cache>;
    activeWatcher: Watch;
    add(target: Watch | Cache): void;
    start(): void;
    end(): void;
    private forceUpdate;
    /**
     * You can run watchers of a state with `update` method.
     * ```typescript
     * const count = new State(0)
     *
     * new Watch(() => {
     *   console.log(count.value)
     * })
     * // console.log(0)
     *
     * count.update()
     * // console.log(0)
     * ```
     * */
    update(): void;
}
export declare const globalEvent: Event;
