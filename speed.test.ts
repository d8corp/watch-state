import perfocode, {describe, test} from 'perfocode'
import {State, Watch, state, Cache, cache, createEvent} from './src'
import {autorun, observable, computed, reaction, action} from 'mobx'
import {createEvent as ce, createStore as cs} from 'effector'

import {createStore} from 'redux'

perfocode('speed.test', () => {
  test('empty test', () => {})
  describe('empty create', () => {
    describe('state', () => {
      test('watch-state', () => new State())
      test('mobx', () => observable.box())
    })
    describe('watch', () => {
      test('watch-state', () => new Watch(() => {}).destructor())
      test('mobx: autorun', () => autorun(() => {})())
      test('mobx: reaction', () => reaction(() => {}, () => {})())
    })
    describe('computed', () => {
      test('watch-state', () => new Cache(() => {}).destructor())
      test('mobx', () => computed(() => {}))
    })
  })
  describe('watch state', () => {
    const wsColor = new State('red')
    const mobxColor1 = observable.box('red')
    const mobxColor2 = observable.box('red')
    const messageEvent = ce()

    test('watch-state', () => new Watch(() => wsColor.value).destructor())
    test('mobx: autorun', () => autorun(() => mobxColor1.get())())
    test('mobx: reaction', () => reaction(() => mobxColor2.get(), () => {})())
    test('effector', () => messageEvent.watch(() => {}))
  })
  describe('update', () => {
    const state = new State(0)
    const stateMobx1 = observable.box(0)
    const stateMobx2 = observable.box(0)
    const increment = ce()
    const store = cs(0).on(increment, state => state + 1)

    const watcher = new Watch(() => state.value)
    const dispatcher1 = autorun(() => stateMobx1.get())
    const dispatcher2 = reaction(() => stateMobx2.get(), () => {})
    store.watch(() => {})

    test('watch-state', () => state.value++)
    watcher.destructor()
    test('mobx: autorun', () => stateMobx1.set(stateMobx1.get() + 1))
    dispatcher1()
    test('mobx: reaction', () => stateMobx2.set(stateMobx2.get() + 1))
    dispatcher2()
    test('effector', () => increment())
  })
  describe('decorators', () => {
    describe('state decorator', () => {
      describe('one empty', () => {
        class Color {
          @state value
        }
        class Mobx1Color {
          @observable value
        }
        class Mobx2Color {
          @observable.ref value
        }

        test('watch-state', () => new Color())
        test('mobx: observable', () => new Mobx1Color())
        test('mobx: observable.ref', () => new Mobx2Color())
      })
      describe('one set in constructor', () => {
        class Color {
          @state value
          constructor (value = 'red') {
            this.value = value
          }
        }
        class Mobx1Color {
          @observable value
          constructor (value = 'red') {
            this.value = value
          }
        }
        class Mobx2Color {
          @observable.ref value
          constructor (value = 'red') {
            this.value = value
          }
        }

        test('watch-state', () => new Color())
        test('mobx: observable', () => new Mobx1Color())
        test('mobx: observable.ref', () => new Mobx2Color())
      })
      describe('one with default', () => {
        class Color {
          @state value = 'black'
        }
        class Mobx1Color {
          @observable value = 'black'
        }
        class Mobx2Color {
          @observable.ref value = 'black'
        }

        test('watch-state', () => new Color())
        test('mobx: observable', () => new Mobx1Color())
        test('mobx: observable.ref', () => new Mobx2Color())
      })
      describe('one with default and set in constructor', () => {
        class Color {
          @state value = 'black'
          constructor (value = 'red') {
            this.value = value
          }
        }
        class Mobx1Color {
          @observable value = 'black'
          constructor (value = 'red') {
            this.value = value
          }
        }
        class Mobx2Color {
          @observable.ref value = 'black'
          constructor (value = 'red') {
            this.value = value
          }
        }

        test('watch-state', () => new Color())
        test('mobx: observable', () => new Mobx1Color())
        test('mobx: observable.ref', () => new Mobx2Color())
      })
      describe('two', () => {
        class Color {
          @state key
          @state value
          constructor (key = 'test', value = 'red') {
            this.key = key
            this.value = value
          }
        }
        class Mobx1Color {
          @observable key
          @observable value
          constructor (key = 'test', value = 'red') {
            this.key = key
            this.value = value
          }
        }
        class Mobx2Color {
          @observable.ref key
          @observable.ref value
          constructor (key = 'test', value = 'red') {
            this.key = key
            this.value = value
          }
        }

        test('watch-state', () => new Color())
        test('mobx: observable', () => new Mobx1Color())
        test('mobx: observable.ref', () => new Mobx2Color())
      })
    })
    describe('cache decorator', () => {
      class User {
        @cache get fullName () {
          return ''
        }
      }
      class UserMobx {
        @computed get fullName () {
          return ''
        }
      }
      test('watch-state', () => new User())
      test('mobx', () => new UserMobx())
    })
    describe('cache and state decorators', () => {
      class User {
        @state name = 'Mike'
        @state surname = 'Mighty'
        @cache get fullName () {
          return `${this.name} ${this.surname[0]}`
        }
      }
      class UserMobx {
        @observable.ref name = 'Mike'
        @observable.ref surname = 'Mighty'
        @computed get fullName () {
          return `${this.name} ${this.surname[0]}`
        }
      }

      test('watch-state', () => new User())
      test('mobx', () => new UserMobx())
    })
  })
  describe('event', () => {
    describe('without event x10', () => {
      const state1 = new State(0)
      const state2 = observable.box(0)
      const watcher1 = new Watch(() => state1.value)
      const watcher2 = autorun(() => state2.get())
      test('watch-state', () => {
        for (let i = 0; i < 10; i++) {
          state1.value++
        }
      })
      watcher1.destructor()
      test('mobx', () => {
        for (let i = 0; i < 10; i++) {
          state2.set(state2.get() + 1)
        }
      })
      watcher2()
    })
    describe('with event x10', () => {
      const state1 = new State(0)
      const state2 = observable.box(0)
      const watcher1 = new Watch(() => state1.value)
      const watcher2 = autorun(() => state2.get())
      const event1 = createEvent(() => {
        for (let i = 0; i < 10; i++) {
          state1.value++
        }
      })
      const event2 = action(() => {
        for (let i = 0; i < 10; i++) {
          state2.set(state2.get() + 1)
        }
      })
      test('watch-state', () => {
        event1()
      })
      watcher1.destructor()
      test('mobx', () => {
        event2()
      })
      watcher2()
    })
  })
  describe('complex', () => {
    test('watch-state', () => {
      const state = new State(1000)
      const watcher = new Watch(() => state.value)
      while (state.value--) {}
      watcher.destructor()
    })
    test('mobx', () => {
      const state = observable.box(1000)
      const disposer = autorun(() => state.get())
      while (state.get()) {
        state.set(state.get() - 1)
      }
      disposer()
    })
    test('redux', () => {
      function reducer (state, action) {
        if (action.type === 'DECREMENT') {
          return {...state, count: state.count - 1}
        }
        return state
      }
      const store = createStore(reducer, {count: 1000})
      const destructor = store.subscribe(() => store.getState().count)

      while (store.getState().count) {
        store.dispatch({type: 'DECREMENT'})
      }
      destructor()
    })
    test('effector', () => {
      const decrement = ce()
      const counter = cs(1000).on(decrement, state => state - 1)
      counter.watch(() => {})
      while (counter.getState()) {
        decrement()
      }
    })
  })
}, 300)
