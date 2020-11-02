'use strict';

var colors = require('colors');
var mobx = require('mobx');
var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var colors__default = /*#__PURE__*/_interopDefaultLegacy(colors);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

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

let currentTimeout = 200;
let file = {};
const deep = [];
function perf(callback, ms = currentTimeout) {
    let count = 0;
    const endTime = Date.now() + ms;
    do {
        callback();
        count++;
    } while (Date.now() < endTime);
    return count / ms;
}
function getDeep() {
    let result = '';
    for (let i = 0; i < deep.length; i++) {
        result += '│';
    }
    return result;
}
function describe(name, callback, timeout = currentTimeout) {
    const beforeTimeout = currentTimeout;
    currentTimeout = timeout;
    console.log(getDeep() + '╒ ' + name);
    deep.push(name);
    callback();
    deep.pop();
    console.log(getDeep() + '╘ ' + name);
    currentTimeout = beforeTimeout;
}
function test(test, callback, timeout = currentTimeout) {
    const value = perf(callback, timeout);
    let minColor = colors__default['default'].gray;
    let maxColor = colors__default['default'].gray;
    let beforeMin = '';
    let beforeMax = '';
    let object = file;
    for (const name of deep) {
        if (!(name in object)) {
            object[name] = {};
        }
        object = object[name];
    }
    if (test in object) {
        if (value < object[test].min) {
            minColor = colors__default['default'].red;
            beforeMin = colors__default['default'].gray(object[test].min + ' < ');
            object[test].min = value;
        }
        else if (value > object[test].max) {
            maxColor = colors__default['default'].green;
            beforeMax = colors__default['default'].gray(' > ' + object[test].max);
            object[test].max = value;
        }
    }
    else {
        minColor = colors__default['default'].yellow;
        maxColor = colors__default['default'].yellow;
        object[test] = {
            min: value,
            max: value,
        };
    }
    let deepPrefix = getDeep();
    if (deepPrefix) {
        deepPrefix = deepPrefix.slice(0, -1) + '╞';
    }
    console.log(`${deepPrefix} ${test}: ${minColor(`${object[test].min} < `)}${beforeMin}${value}${beforeMax}${maxColor(` > ${object[test].max}`)}`);
}
function performanceTest(output, callback, timeout = currentTimeout) {
    currentTimeout = timeout;
    try {
        file = JSON.parse(fs__default['default'].readFileSync(output + '.json'));
    }
    catch (e) { }
    callback();
    fs__default['default'].writeFileSync(output + '.json', JSON.stringify(file, null, 2));
}
performanceTest('speed-test', () => {
    test('empty test', () => { });
    describe('create', () => {
        describe('state', () => {
            test('watch-state', () => new State());
            test('mobx: observable.box', () => mobx.observable.box());
        });
        describe('watch', () => {
            test('watch-state: Watch', () => new Watch(() => { }));
            test('watch-state: watch', () => watch(() => { }));
            test('mobx: autorun', () => mobx.autorun(() => { }));
        });
        describe('computed', () => {
            test('watch-state', () => new Computed(() => { }));
            test('mobx', () => mobx.computed(() => { }));
        });
        describe('computed decorator', () => {
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
            test('watch-state', () => new User());
            test('mobx', () => new UserMobx());
        });
        describe('computed and state decorators', () => {
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
            test('watch-state', () => new User());
            test('mobx', () => new UserMobx());
        });
    });
    describe('update', () => {
        const state = new State(0);
        const stateMobx1 = mobx.observable.box(0);
        const stateMobx2 = mobx.observable.box(0);
        watch(() => state.value);
        mobx.autorun(() => stateMobx1.get());
        mobx.reaction(() => stateMobx2.get(), () => { });
        test('watch-state', () => state.value++);
        test('mobx: autorun', () => stateMobx1.set(stateMobx1.get() + 1));
        test('mobx: reaction', () => stateMobx2.set(stateMobx2.get() + 1));
    });
    describe('watch state', () => {
        const wsColor = new State('red');
        const mobxColor = mobx.observable.box('red');
        test('watch-state', () => watch(() => wsColor.value));
        test('mobx', () => mobx.autorun(() => mobxColor.get()));
    });
    describe('state decorator', () => {
        describe('one', () => {
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
            test('watch-state', () => new Color());
            test('mobx: observable', () => new Mobx1Color());
            test('mobx: observable.ref', () => new Mobx2Color());
        });
        describe('one with default', () => {
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
            test('watch-state', () => new Color());
            test('mobx: observable', () => new Mobx1Color());
            test('mobx: observable.ref', () => new Mobx2Color());
        });
        describe('two', () => {
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
            test('watch-state', () => new Color());
            test('mobx: observable', () => new Mobx1Color());
            test('mobx: observable.ref', () => new Mobx2Color());
        });
    });
    describe('complex', () => {
        test('watch-state', () => {
            const state = new State(1000);
            const watcher = watch(() => state.value);
            while (state.value--) { }
            watcher.destructor();
        });
        test('mobx', () => {
            const state = mobx.observable.box(1000);
            const disposer = mobx.autorun(() => state.get());
            while (state.get()) {
                state.set(state.get() - 1);
            }
            disposer();
        });
    });
});
