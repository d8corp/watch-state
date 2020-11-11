import '../../utils/scope/scope.es6.js';
import stateValues from '../../utils/stateValues/stateValues.es6.js';
import '../../utils/onClear/onClear.es6.js';
import { State } from '../../classes/State/State.es6.js';

function state(target, propertyKey, desc) {
    const value = desc ? (desc.initializer ? desc.initializer() : desc.value) : undefined;
    return {
        get() {
            const values = stateValues(this);
            if (!(propertyKey in values)) {
                values[propertyKey] = new State(value);
            }
            return values[propertyKey].value;
        },
        set(v) {
            const values = stateValues(this);
            if (!(propertyKey in values)) {
                values[propertyKey] = new State(v);
            }
            else {
                values[propertyKey].value = v;
            }
        },
        enumerable: true
    };
}

export default state;
export { state };
