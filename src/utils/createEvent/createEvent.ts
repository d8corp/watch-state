import Event from '/classes/Event'

function createEvent <T extends Function> (target: T): T {
  return function () {
    if (Event.activeEvent) {
      return target.apply(this, arguments)
    } else {
      const event = new Event()
      event.start()
      const result = target.apply(this, arguments)
      event.end()
      return result
    }
  } as unknown as T
}

export default createEvent

export {
  createEvent,
}
