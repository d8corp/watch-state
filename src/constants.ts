import { Event } from './Event'
import { Scope } from './types'

export const globalEvent = new Event()

export const scope: Scope = {
  activeWatcher: undefined,
  activeEvent: undefined,
  activeEventDeep: 0,
}
