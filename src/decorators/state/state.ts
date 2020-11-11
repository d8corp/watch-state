import stateValues from '../../utils/stateValues'
import State from '../../classes/State'

interface StateValues {
  [key: string]: State
}

function state (target: Object, propertyKey: string, desc?): any {
  const value = desc ? (
    desc.initializer ? desc.initializer() : desc.value
  ) : undefined
  return {
    get (): any {
      const values = stateValues(this)
      if (!(propertyKey in values)) {
        values[propertyKey] = new State(value)
      }
      return values[propertyKey].value
    },
    set (v: any): void {
      const values: StateValues = stateValues(this) as StateValues
      if (!(propertyKey in values)) {
        values[propertyKey] = new State(v)
      } else {
        values[propertyKey].value = v
      }
    },
    enumerable: true
  }
}

export default state

export {
  state,
  StateValues
}
