import '../../utils/scope/scope.es6.js';
import '../../utils/createEvent/createEvent.es6.js';
import getDecors from '../../utils/getDecors/getDecors.es6.js';
import { State } from '../../classes/State/State.es6.js';

function state(target, propertyKey, desc) {
    const value = desc ? (desc.initializer ? desc.initializer() : desc.value) : undefined;
    return {
        get() {
            const values = getDecors(this);
            if (!(propertyKey in values)) {
                values[propertyKey] = new State(value);
            }
            return values[propertyKey].value;
        },
        set(v) {
            const values = getDecors(this);
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
