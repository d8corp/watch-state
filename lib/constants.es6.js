import { Event } from './Event/Event.es6.js';

const globalEvent = new Event();
const scope = {
    activeWatcher: undefined,
    activeEvent: undefined,
    activeEventDeep: 0,
};

export { globalEvent, scope };
