import '../../utils/scope/scope.es6.js';
import unwatch from '../../utils/unwatch/unwatch.es6.js';
import stateValues from '../../utils/stateValues/stateValues.es6.js';
import '../../utils/onClear/onClear.es6.js';
import '../../classes/Watch/Watch.es6.js';
import '../../classes/State/State.es6.js';
import Cache from '../../classes/Cache/Cache.es6.js';

function cache(target, propertyKey, descriptor) {
    const { get: originalGet } = descriptor;
    return {
        get() {
            const values = stateValues(this);
            if (!(propertyKey in values)) {
                unwatch(() => values[propertyKey] = new Cache(originalGet.bind(this)));
            }
            return values[propertyKey].value;
        },
        enumerable: true
    };
}

export default cache;
export { cache };
