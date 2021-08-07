import {Watch, Event} from '..'

export interface Scope {
  activeWatcher?: Watch
  activeEvent?: Event
  activeEventDeep: number
}

export const scope: Scope = {
  activeWatcher: undefined,
  activeEvent: undefined,
  activeEventDeep: 0,
}
