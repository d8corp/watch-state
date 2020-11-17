import '../../utils/scope/scope.es6.js';
import '../../utils/createEvent/createEvent.es6.js';
import unwatch from '../../utils/unwatch/unwatch.es6.js';
import stateValues from '../../utils/stateValues/stateValues.es6.js';
import '../../utils/onClear/onClear.es6.js';
import '../../classes/Watch/Watch.es6.js';
import '../../classes/State/State.es6.js';
import Mixer from '../../classes/Mixer/Mixer.es6.js';

function mixer(target, propertyKey, descriptor) {
    const { value, get: originalGet = value } = descriptor;
    return {
        get() {
            const values = stateValues(this);
            if (!(propertyKey in values)) {
                unwatch(() => values[propertyKey] = new Mixer(originalGet.bind(this)));
            }
            return values[propertyKey].value;
        },
        enumerable: true
    };
}

export default mixer;
export { mixer };