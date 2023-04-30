import '../helpers/index.es6.js';
import '../Observable/index.es6.js';
import { Observable } from '../Observable/Observable.es6.js';
import { queueWatchers } from '../helpers/queueWatchers/queueWatchers.es6.js';

class State extends Observable {
    constructor(value) {
        super();
        this.rawValue = value;
    }
    get value() {
        return super.value;
    }
    set value(value) {
        if (this.rawValue !== value) {
            this.rawValue = value;
            this.update();
        }
    }
    update() {
        queueWatchers(this.observers);
    }
}

export { State };
