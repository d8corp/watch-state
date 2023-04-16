import { createEvent as createEffectorEvent, createStore as createEffectorStore } from 'effector'
import mazzard from 'mazzard'
import { action, autorun, computed, configure, observable, reaction } from 'mobx'
import perfocode, { describe, test } from 'perfocode'
import { createStore } from 'redux'
import { createStoreon } from 'storeon'

import { Cache, createEvent, State, Watch } from './src'

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
        test('watch-state', () => new Watch(() => {}))
        test('mobx: autorun', () => autorun(() => {}))
        test('mobx: reaction', () => reaction(() => {}, () => {}))
      })
      describe('watch + destroy', () => {
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
      const messageEvent = createEffectorEvent()

      test('watch-state', () => new Watch(() => wsColor.value).destroy())
      test('mobx: autorun', () => autorun(() => mobxColor1.get())())
      test('mobx: reaction', () => reaction(() => mobxColor2.get(), () => {})())
      test('effector', () => messageEvent.watch(() => {}))
    })
    describe('update', () => {
      const state = new State(0)
      const stateMobx1 = observable.box(0)
      const stateMobx2 = observable.box(0)
      const increment = createEffectorEvent()
      const store = createEffectorStore(0).on(increment, state => state + 1)

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
        return { ...state, count: state.count + 1 }
      }
      return state
    }
    const store = createStore(reducer, { count: 0 })
    const destroy = store.subscribe(() => store.getState().count)

    // effector
    const increment = createEffectorEvent()
    const counter = createEffectorStore(0).on(increment, state => state + 1)
    counter.watch(count => count)

    // mazzard
    const MAState = mazzard({ value: 0 })
    const MAWatch = mazzard(() => MAState.value)

    // storeon
    const count = store => {
      store.on('@init', () => ({ count: 0 }))
      store.on('inc', ({ count }) => ({ count: count + 1 }))
    }
    const SStore = createStoreon<any>([count])

    const SDispatch = SStore.on('inc', ({ count }) => count)

    test('watch-state', () => {
      WSState.value++
    })

    test('mobx', () => {
      MXState.set(MXState.get() + 1)
    })

    test('redux', () => {
      store.dispatch({ type: 'INCREMENT' })
    })

    test('effector', () => {
      increment()
    })

    test('mazzard', () => {
      MAState.value++
    })

    test('storeon', () => {
      SStore.dispatch('inc')
    })

    watcher.destroy()
    disposer()
    destroy()
    MAWatch()
    SDispatch()
  })
  describe('counter', () => {
    const COUNT = 1000

    const testLog = (log: number[]) => {
      if (log.length < COUNT) {
        throw Error(`test failed: log.length expected: ${COUNT}, actual: ${log.length}`)
      }

      if (log[0] !== COUNT) {
        throw Error(`test failed: log[0] expected: ${COUNT}, actual: ${log[0]}`)
      }

      if (log[COUNT] !== 0) {
        throw Error(`test failed: log[${COUNT}] expected: 0, actual: ${log[COUNT]}`)
      }
    }

    test('watch-state', () => {
      const log = []
      const state = new State(COUNT)
      const watcher = new Watch(() => log.push(state.value))

      while (state.value--) { /* empty */ }

      testLog(log)
      watcher.destroy()
    })
    test('mobx', () => {
      const log = []
      const state = observable.box(COUNT)
      const disposer = autorun(() => log.push(state.get()))

      while (state.get()) {
        state.set(state.get() - 1)
      }

      testLog(log)
      disposer()
    })
    test('redux', () => {
      const log = []
      function reducer (state, action) {
        if (action.type === 'DECREMENT') {
          return { ...state, count: state.count - 1 }
        }
        return state
      }
      const store = createStore(reducer, { count: COUNT })
      log.push(store.getState().count)
      const destroy = store.subscribe(() => log.push(store.getState().count))

      while (store.getState().count) {
        store.dispatch({ type: 'DECREMENT' })
      }

      testLog(log)
      destroy()
    })
    test('mazzard', () => {
      const log = []
      const store = mazzard({ value: COUNT })
      const stop = mazzard(() => log.push(store.value))

      while (store.value--) { /* empty */ }

      testLog(log)
      stop()
    })
    test('effector', () => {
      const log = []
      const decrement = createEffectorEvent()
      const counter = createEffectorStore(COUNT).on(decrement, state => state - 1)

      const subscription = counter.watch(state => {
        log.push(state)
      })

      while (counter.getState()) {
        decrement()
      }

      testLog(log)
      subscription.unsubscribe()
    })
    test('storeon', () => {
      const log = []
      const count = store => {
        store.on('@init', () => ({ count: COUNT }))
        store.on('dec', ({ count }) => ({ count: count - 1 }))
      }
      const store = createStoreon<any>([count])

      log.push(store.get().count)
      const dispatch = store.on('dec', ({ count }) => {
        log.push(count)
      })

      while (store.get().count) {
        store.dispatch('dec')
      }

      testLog(log)
      dispatch()
    })
  })
}, 300)
