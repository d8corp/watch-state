import '../../utils/scope/scope.es6.js';
import createEvent from '../../utils/createEvent/createEvent.es6.js';

function event(target, propertyKey, descriptor) {
    return {
        value: createEvent(descriptor.value),
        enumerable: true
    };
}

export default event;
export { event };
