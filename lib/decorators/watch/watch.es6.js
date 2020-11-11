import '../../utils/scope/scope.es6.js';
import '../../utils/onClear/onClear.es6.js';
import Watch from '../../classes/Watch/Watch.es6.js';

function watch(target, propertyKey, descriptor) {
    return {
        value() {
            return new Watch(descriptor.value.bind(this));
        },
        enumerable: true
    };
}

export default watch;
export { watch };
