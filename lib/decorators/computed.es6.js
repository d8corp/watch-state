import '../Scope.es6.js';
import { unwatch } from '../Watch.es6.js';
import '../State.es6.js';
import Computed from '../Computed.es6.js';
import stateValues from '../stateValue.es6.js';

function computed(target, propertyKey, descriptor) {
    const { get: originalGet } = descriptor;
    return {
        get() {
            const values = stateValues(this);
            if (!(propertyKey in values)) {
                unwatch(() => values[propertyKey] = new Computed(originalGet.bind(this)));
            }
            return values[propertyKey].value;
        },
        enumerable: true
    };
}

export default computed;
export { computed };
