import perfocode, {describe, test} from 'perfocode'
import {State, Watch, state, createEvent, watch, cache, Cache} from './src'
import {autorun, observable, computed, reaction, action, makeObservable, configure} from 'mobx'
import {createEvent as ce, createStore as cs} from 'effector'
import mazzard from 'mazzard'

import {createStore} from 'redux'

configure({
  enforceActions: 'never',
})

perfocode('speed.test', () => {
  test('max value', () => {})
  describe('watch-state vs mobx', () => {
    describe('empty create', () => {
      describe('state', () => {
        test('watch-state', () => new State())
        test('mobx', () => observable.box())
      })
      describe('watch', () => {
        test('watch-state', () => new Watch(() => {}).destroy())
        test('mobx: autorun', () => autorun(() => {})())
        test('mobx: reaction', () => reaction(() => {}, () => {})())
      })
      describe('computed', () => {
        test('watch-state', () => new Cache(() => {}).destroy())
        test('mobx', () => computed(() => {}))
      })
    })
    describe('watch state', () => {
      const wsColor = new State('red')
      const mobxColor1 = observable.box('red')
      const mobxColor2 = observable.box('red')
      const messageEvent = ce()

      test('watch-state', () => new Watch(() => wsColor.value).destroy())
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
      watcher.destroy()
      test('mobx: autorun', () => stateMobx1.set(stateMobx1.get() + 1))
      dispatcher1()
      test('mobx: reaction', () => stateMobx2.set(stateMobx2.get() + 1))
      dispatcher2()
      test('effector', () => increment())
    })
    describe('decorators', () => {
      describe('state decorator', () => {
        describe('one empty', () => {
          class Color1 {
            @state value
          }

          class Color2 {
            value = undefined
            constructor () {
              makeObservable(this, {
                value: observable
              })
            }
          }

          test('watch-state', () => new Color1())
          test('mobx: observable', () => new Color2())
        })
        describe('one set in constructor', () => {
          class Color1 {
            @state value
            constructor (value = 'red') {
              this.value = value
            }
          }
          class Color2 {
            value = undefined
            constructor (value = 'red') {
              makeObservable(this, {
                value: observable
              })
              this.value = value
            }
          }

          test('watch-state', () => new Color1())
          test('mobx: observable', () => new Color2())
        })
        describe('one with default', () => {
          class Color1 {
            @state value = 'black'
          }
          class Color2 {
            value = 'black'
            constructor () {
              makeObservable(this, {
                value: observable
              })
            }
          }

          test('watch-state', () => new Color1())
          test('mobx: observable', () => new Color2())
        })
        describe('one with default and set in constructor', () => {
          class Color1 {
            @state value = 'black'
            constructor (value = 'red') {
              this.value = value
            }
          }
          class Color2 {
            value = 'black'
            constructor (value = 'red') {
              makeObservable(this, {
                value: observable
              })
              this.value = value
            }
          }

          test('watch-state', () => new Color1())
          test('mobx: observable', () => new Color2())
        })
        describe('two', () => {
          class Color1 {
            @state key
            @state value
            constructor (key = 'test', value = 'red') {
              this.key = key
              this.value = value
            }
          }
          class Color2 {
            key = undefined
            value = undefined
            constructor (key = 'test', value = 'red') {
              makeObservable(this, {
                key: observable,
                value: observable,
              })
              this.key = key
              this.value = value
            }
          }

          test('watch-state', () => new Color1())
          test('mobx: observable', () => new Color2())
        })
      })
      describe('cache decorator', () => {
        class User1 {
          @cache get fullName () {
            return ''
          }
        }
        class User2 {
          get fullName () {
            return ''
          }
          constructor () {
            makeObservable(this, {
              fullName: computed
            })
          }
        }
        test('watch-state', () => new User1())
        test('mobx', () => new User2())
      })
      describe('cache and state decorators', () => {
        class User1 {
          @state name = 'Mike'
          @state surname = 'Mighty'
          @cache get fullName () {
            return `${this.name} ${this.surname[0]}`
          }
        }
        class User2 {
          name = 'Mike'
          surname = 'Mighty'
          get fullName () {
            return `${this.name} ${this.surname[0]}`
          }
          constructor () {
            makeObservable(this, {
              name: observable,
              surname: observable,
              fullName: computed,
            })
          }
        }

        test('watch-state', () => new User1())
        test('mobx', () => new User2())
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
        watcher1.destroy()

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
        watcher1.destroy()
        test('mobx', () => {
          event2()
        })
        watcher2()
      })
    })
  })
  describe('update watched value', () => {
    // watch-state
    const WSState = new State(0)
    const watcher = new Watch(() => WSState.value)
    // mobx
    const MXState = observable.box(0)
    const disposer = autorun(() => MXState.get())
    // redux
    function reducer (state, action) {
      if (action.type === 'INCREMENT') {
        return {...state, count: state.count + 1}
      }
      return state
    }
    const store = createStore(reducer, {count: 0})
    const destroy = store.subscribe(() => store.getState().count)
    // effector
    const increment = ce()
    const counter = cs(0).on(increment, state => state + 1)
    counter.watch(() => {})

    test('watch-state', () => {
      WSState.value++
    })

    test('mobx', () => {
      MXState.set(MXState.get() + 1)
    })

    test('redux', () => {
      store.dispatch({type: 'INCREMENT'})
    })

    test('effector', () => {
      increment()
    })

    watcher.destroy()
    disposer()
    destroy()
  })
  describe('complex', () => {
    const COUNT = 1000
    test('watch-state', () => {
      const state = new State(COUNT)
      const watcher = new Watch(() => state.value)
      while (state.value--) {}
      watcher.destroy()
    })
    test('mobx', () => {
      const state = observable.box(COUNT)
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
      const store = createStore(reducer, {count: COUNT})
      const destroy = store.subscribe(() => store.getState().count)

      while (store.getState().count) {
        store.dispatch({type: 'DECREMENT'})
      }
      destroy()
    })
    test('mazzard', () => {
      const store = mazzard({value: COUNT})
      const stop = mazzard(() => store.value)

      while (store.value--) {}
      stop()
    })
    test('effector', () => {
      const decrement = ce()
      const counter = cs(COUNT).on(decrement, state => state - 1)
      counter.watch(() => {})
      while (counter.getState()) {
        decrement()
      }
    })
  })
}, 300)
