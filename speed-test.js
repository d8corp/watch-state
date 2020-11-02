'use strict';

var perfocode = require('perfocode');
var mobx = require('mobx');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var perfocode__default = /*#__PURE__*/_interopDefaultLegacy(perfocode);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

const scope = {};

class Watch {
    constructor(target) {
        this.target = target;
        this.rendered = false;
        this.update();
    }
    update() {
        this.clear(this.cleaners, this.rendered);
        onClear(() => this.destructor());
        const prevWatcher = scope.activeWatcher;
        scope.activeWatcher = this;
        this.target(this.rendered);
        scope.activeWatcher = prevWatcher;
        this.rendered = true;
    }
    destructor() {
        this.clear(this.destructors, false);
    }
    clear(callbacks, update) {
        if (callbacks) {
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i](update);
            }
        }
        this.cleaners = undefined;
        this.destructors = undefined;
    }
    onDestructor(callback) {
        if (this.destructors) {
            this.destructors.push(callback);
        }
        else {
            this.destructors = [callback];
        }
    }
    onUpdate(callback) {
        if (this.cleaners) {
            this.cleaners.push(callback);
        }
        else {
            this.cleaners = [callback];
        }
    }
    onClear(callback) {
        this.onUpdate(callback);
        this.onDestructor(callback);
    }
}
function watch(target) {
    return new Watch(target);
}
function onDestructor(callback) {
    if (scope.activeWatcher) {
        scope.activeWatcher.onDestructor(callback);
        return true;
    }
    return false;
}
function onClear(callback) {
    if (scope.activeWatcher) {
        scope.activeWatcher.onClear(callback);
        return true;
    }
    return false;
}

const VALUES = Symbol('state values');
function stateValues(target) {
    if (!(VALUES in target)) {
        target[VALUES] = {};
    }
    return target[VALUES];
}

class State {
    constructor(value) {
        this.target = value;
    }
    get value() {
        const { activeWatcher } = scope;
        const { watchers } = this;
        if (activeWatcher && !watchers.has(activeWatcher)) {
            watchers.add(activeWatcher);
            onClear(update => {
                if (!update || watchers === this.watchers) {
                    watchers.delete(activeWatcher);
                }
            });
        }
        return this.target;
    }
    set value(value) {
        if (value !== this.target) {
            this.target = value;
            const { watchers } = this;
            if (watchers.size) {
                this._watchers = undefined;
                {
                    watchers.forEach(watcher => watcher.update());
                }
            }
        }
    }
    get watchers() {
        return this._watchers || (this._watchers = new Set());
    }
}
function state(target, propertyKey) {
    Object.defineProperty(target, propertyKey, {
        get() {
            const values = stateValues(this);
            if (!(propertyKey in values)) {
                values[propertyKey] = new State();
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
    });
}

function lock(target) {
    const prevWatcher = scope.activeWatcher;
    scope.activeWatcher = undefined;
    const result = target();
    scope.activeWatcher = prevWatcher;
    return result;
}

class Computed {
    constructor(target) {
        this.target = target;
        this._value = new State();
        this._watchersCount = 0;
    }
    get value() {
        const destructor = () => {
            this._watchersCount--;
            if (!this._watchersCount) {
                this._watcher.destructor();
                this._watcher = undefined;
            }
        };
        if (onDestructor(destructor)) {
            this._watchersCount++;
        }
        if (!this._watchersCount) {
            return this.target();
        }
        if (!this._watcher) {
            lock(() => {
                this._watcher = new Watch(() => {
                    this._value.value = this.target();
                });
            });
        }
        return this._value.value;
    }
}
function computed(target, propertyKey, descriptor) {
    const { get } = descriptor;
    return Object.assign({}, descriptor, {
        get() {
            const values = stateValues(this);
            if (!(propertyKey in values)) {
                lock(() => values[propertyKey] = new Computed(get.bind(this)));
            }
            return values[propertyKey].value;
        }
    });
}

perfocode__default['default']('speed-test', () => {
    perfocode.test('empty test', () => { });
    perfocode.describe('create', () => {
        perfocode.describe('state', () => {
            perfocode.test('watch-state', () => new State());
            perfocode.test('mobx: observable.box', () => mobx.observable.box());
        });
        perfocode.describe('watch', () => {
            perfocode.test('watch-state: Watch', () => new Watch(() => { }));
            perfocode.test('watch-state: watch', () => watch(() => { }));
            perfocode.test('mobx: autorun', () => mobx.autorun(() => { }));
        });
        perfocode.describe('computed', () => {
            perfocode.test('watch-state', () => new Computed(() => { }));
            perfocode.test('mobx', () => mobx.computed(() => { }));
        });
        perfocode.describe('computed decorator', () => {
            class User {
                get fullName() {
                    return '';
                }
            }
            __decorate([
                computed
            ], User.prototype, "fullName", null);
            class UserMobx {
                get fullName() {
                    return '';
                }
            }
            __decorate([
                mobx.computed
            ], UserMobx.prototype, "fullName", null);
            perfocode.test('watch-state', () => new User());
            perfocode.test('mobx', () => new UserMobx());
        });
        perfocode.describe('computed and state decorators', () => {
            class User {
                constructor() {
                    this.name = 'Mike';
                    this.surname = 'Mighty';
                }
                get fullName() {
                    return `${this.name} ${this.surname[0]}`;
                }
            }
            __decorate([
                state
            ], User.prototype, "name", void 0);
            __decorate([
                state
            ], User.prototype, "surname", void 0);
            __decorate([
                computed
            ], User.prototype, "fullName", null);
            class UserMobx {
                constructor() {
                    this.name = 'Mike';
                    this.surname = 'Mighty';
                }
                get fullName() {
                    return `${this.name} ${this.surname[0]}`;
                }
            }
            __decorate([
                mobx.observable.ref
            ], UserMobx.prototype, "name", void 0);
            __decorate([
                mobx.observable.ref
            ], UserMobx.prototype, "surname", void 0);
            __decorate([
                mobx.computed
            ], UserMobx.prototype, "fullName", null);
            perfocode.test('watch-state', () => new User());
            perfocode.test('mobx', () => new UserMobx());
        });
    });
    perfocode.describe('update', () => {
        const state = new State(0);
        const stateMobx1 = mobx.observable.box(0);
        const stateMobx2 = mobx.observable.box(0);
        watch(() => state.value);
        mobx.autorun(() => stateMobx1.get());
        mobx.reaction(() => stateMobx2.get(), () => { });
        perfocode.test('watch-state', () => state.value++);
        perfocode.test('mobx: autorun', () => stateMobx1.set(stateMobx1.get() + 1));
        perfocode.test('mobx: reaction', () => stateMobx2.set(stateMobx2.get() + 1));
    });
    perfocode.describe('watch state', () => {
        const wsColor = new State('red');
        const mobxColor = mobx.observable.box('red');
        perfocode.test('watch-state', () => watch(() => wsColor.value));
        perfocode.test('mobx', () => mobx.autorun(() => mobxColor.get()));
    });
    perfocode.describe('state decorator', () => {
        perfocode.describe('one', () => {
            class Color {
                constructor(value = 'red') {
                    this.value = value;
                }
            }
            __decorate([
                state
            ], Color.prototype, "value", void 0);
            class Mobx1Color {
                constructor(value = 'red') {
                    this.value = value;
                }
            }
            __decorate([
                mobx.observable
            ], Mobx1Color.prototype, "value", void 0);
            class Mobx2Color {
                constructor(value = 'red') {
                    this.value = value;
                }
            }
            __decorate([
                mobx.observable.ref
            ], Mobx2Color.prototype, "value", void 0);
            perfocode.test('watch-state', () => new Color());
            perfocode.test('mobx: observable', () => new Mobx1Color());
            perfocode.test('mobx: observable.ref', () => new Mobx2Color());
        });
        perfocode.describe('one with default', () => {
            class Color {
                constructor(value = 'red') {
                    this.value = 'black';
                    this.value = value;
                }
            }
            __decorate([
                state
            ], Color.prototype, "value", void 0);
            class Mobx1Color {
                constructor(value = 'red') {
                    this.value = 'black';
                    this.value = value;
                }
            }
            __decorate([
                mobx.observable
            ], Mobx1Color.prototype, "value", void 0);
            class Mobx2Color {
                constructor(value = 'red') {
                    this.value = 'black';
                    this.value = value;
                }
            }
            __decorate([
                mobx.observable.ref
            ], Mobx2Color.prototype, "value", void 0);
            perfocode.test('watch-state', () => new Color());
            perfocode.test('mobx: observable', () => new Mobx1Color());
            perfocode.test('mobx: observable.ref', () => new Mobx2Color());
        });
        perfocode.describe('two', () => {
            class Color {
                constructor(key = 'test', value = 'red') {
                    this.key = key;
                    this.value = value;
                }
            }
            __decorate([
                state
            ], Color.prototype, "key", void 0);
            __decorate([
                state
            ], Color.prototype, "value", void 0);
            class Mobx1Color {
                constructor(key = 'test', value = 'red') {
                    this.key = key;
                    this.value = value;
                }
            }
            __decorate([
                mobx.observable
            ], Mobx1Color.prototype, "key", void 0);
            __decorate([
                mobx.observable
            ], Mobx1Color.prototype, "value", void 0);
            class Mobx2Color {
                constructor(key = 'test', value = 'red') {
                    this.key = key;
                    this.value = value;
                }
            }
            __decorate([
                mobx.observable.ref
            ], Mobx2Color.prototype, "key", void 0);
            __decorate([
                mobx.observable.ref
            ], Mobx2Color.prototype, "value", void 0);
            perfocode.test('watch-state', () => new Color());
            perfocode.test('mobx: observable', () => new Mobx1Color());
            perfocode.test('mobx: observable.ref', () => new Mobx2Color());
        });
    });
    perfocode.describe('complex', () => {
        perfocode.test('watch-state', () => {
            const state = new State(1000);
            const watcher = watch(() => state.value);
            while (state.value--) { }
            watcher.destructor();
        });
        perfocode.test('mobx', () => {
            const state = mobx.observable.box(1000);
            const disposer = mobx.autorun(() => state.get());
            while (state.get()) {
                state.set(state.get() - 1);
            }
            disposer();
        });
    });
});
