import { clearNode, createEvent as createEffectorEvent, createStore as createEffectorStore } from 'effector'
import { atom as jotai, createStore as createJotaiStore } from 'jotai/vanilla'
// @ts-expect-error Mazzard does not support TypeScript
import mazzard from 'mazzard'
import { action, autorun, computed, configure, observable, reaction } from 'mobx'
import { atom, computed as nanoComputed } from 'nanostores'
import perfocode, { describe, test } from 'perfocode'
import { createStore } from 'redux'
import { createSelector } from 'reselect'
import { createStoreon } from 'storeon'

import { batch, Compute, State, Watch } from './src'

configure({
  enforceActions: 'never',
})

perfocode('speed.test', () => {
  test('max value', () => {})

  describe('Initialisation', () => {
    describe('State creation', () => {
      test('watch-state', () => new State(0))
      test('Nano Stores', () => atom(0))
      test('Jotai', () => jotai(0))
      test('Jotai: store', () => createJotaiStore())
      test('Effector', () => createEffectorStore(0))
      test('MobX', () => observable.box(0))
      test('Mazzard', () => mazzard({ count: 0 }))
      test('Redux', () => createStore((state = 0) => state))
      test('Redux: object', () => createStore(() => ({ v: 0 })))

      test('Storeon', () => createStoreon([store => {
        store.on('@init', () => ({ count: 0 }))
      }]))
    })

    describe('Compute creation', () => {
      const nano = atom()
      const effectorStore = createEffectorStore(null)

      test('watch-state', () => new Compute(() => {}))
      test('Nano Stores', () => nanoComputed(nano, () => {}))
      test('Jotai', () => jotai(() => {}))
      test('MobX', () => computed(() => {}))
      test('Effector', () => effectorStore.map(state => state))
      test('Mazzard', () => mazzard({ get count () { return undefined } }))

      test('Redux (Reselect)', () => createSelector(
        [(state: any) => state.count],
        (count) => count,
      ))
    })

    describe('Bound Compute creation', () => {
      const wsState = new State(0)
      const jotaiState = jotai(0)
      const mobxState = observable.box(0)
      const nanoState = atom(0)
      const effectorState = createEffectorStore(null)
      const mazzardState = mazzard({ count: 0 })

      test('watch-state', () => new Compute(() => wsState.value))
      test('Jotai', () => jotai(get => get(jotaiState)))
      test('MobX', () => computed(() => mobxState.get()))
      test('Nano Stores', () => nanoComputed(nanoState, () => {}))
      test('Effector', () => effectorState.map(state => state))
      test('Mazzard', () => mazzard({ get count () { return mazzardState.count } }))

      test('Redux (Reselect)', () => createSelector(
        [(state: any) => state.count],
        (count) => count,
      ))
    })

    describe('Compute creation + destroy', () => {
      const wsState = new State(null)
      const effectorStore = createEffectorStore(null)

      test('watch-state', () => new Compute(() => {}).destroy())
      test('watch-state: bound', () => new Compute(() => wsState.value).destroy())
      test('Effector', () => clearNode(effectorStore.map(state => state)))
    })

    describe('subscription', () => {
      describe('Create State subscription', () => {
        const wsColor = new State('red')
        const wsColorAuto = new State('red')
        const mobxColor1 = observable.box('red')
        const mobxColor2 = observable.box('red')
        const nanoColor = atom('red')
        const jotaiColor = jotai('red')
        const jotaiStore = createJotaiStore()
        const effectorStore = createEffectorStore(0)
        const mazzardStore = mazzard({ count: 0 })
        const reduxStore = createStore((state = { color: 'red' }) => state)

        const store = createStoreon([
          store => {
            store.on('@init', () => ({ color: 'red' }))
            store.on('setColor', (state, color) => ({ color }))
          },
        ])

        test('watch-state', () => wsColor.subscribe(() => {}))
        test('watch-state: auto', () => new Watch(() => wsColorAuto.value))
        test('MobX: autorun', () => autorun(() => mobxColor1.get()))
        test('MobX: reaction', () => reaction(() => mobxColor2.get(), () => {}))
        test('Effector', () => effectorStore.watch(() => {}))
        test('Nano Stores', () => nanoColor.subscribe(() => {}))
        test('Jotai', () => jotaiStore.sub(jotaiColor, () => {}))
        test('Storeon', () => store.on('@changed', () => {}))
        test('Mazzard', () => mazzard(() => mazzardStore.count))
        test('Redux', () => reduxStore.subscribe(() => {}))
      })

      describe('Create State subscription + unsubscribe', () => {
        const wsColor = new State('red')
        const mobxColor1 = observable.box('red')
        const mobxColor2 = observable.box('red')
        const messageEvent = createEffectorEvent()
        const nanoColor = atom('red')
        const jotaiColor = jotai('red')
        const jotaiStore = createJotaiStore()
        const effectorStore = createEffectorStore(0)
        const mazzardStore = mazzard({ count: 0 })
        const reduxStore = createStore((state = { color: 'red' }) => state)

        const store = createStoreon([
          store => {
            store.on('@init', () => ({ color: 'red' }))
            store.on('setColor', (state, color) => ({ color }))
          },
        ])

        test('watch-state', () => wsColor.subscribe(() => {})())
        test('watch-state: auto', () => new Watch(() => wsColor.value).destroy())
        test('MobX: autorun', () => autorun(() => mobxColor1.get())())
        test('MobX: reaction', () => reaction(() => mobxColor2.get(), () => {})())
        test('Effector', () => effectorStore.watch(() => {})())
        test('Effector: ME', () => messageEvent.watch(() => {})())
        test('Nano Stores', () => nanoColor.subscribe(() => {})())
        test('Jotai', () => jotaiStore.sub(jotaiColor, () => {})())
        test('Storeon', () => store.on('@changed', () => {})())

        test('Mazzard', () => mazzard((stop: () => void) => {
          stop()

          return mazzardStore.count
        }))

        test('Redux', () => reduxStore.subscribe(() => {})())
      })

      describe('Duplicate State subscription', () => {
        const wsColor = new State('red')
        const wsaColor = new State('red')
        const mobxColor = observable.box('red')
        const mobxColorA = observable.box('red')
        const messageEvent = createEffectorEvent()
        const nanoColor = atom('red')
        const jotaiColor = jotai('red')
        const jotaiStore = createJotaiStore()
        const reduxStore = createStore((state = { color: 'red' }) => state)

        const store = createStoreon([
          store => {
            store.on('@init', () => ({ color: 'red' }))
            store.on('setColor', (state, color) => ({ color }))
          },
        ])

        const listener = () => {}

        test('watch-state', () => wsColor.subscribe(listener))

        test('watch-state: auto', () => new Watch(() => {
          wsaColor.get()
          wsaColor.get()
        }))

        test('Effector', () => messageEvent.watch(listener))
        test('Nano Stores', () => nanoColor.subscribe(listener))
        test('Jotai', () => jotaiStore.sub(jotaiColor, listener))
        test('Storeon', () => store.on('@changed', listener))
        test('Redux', () => reduxStore.subscribe(listener))
        test('MobX', () => reaction(() => mobxColor.get(), listener))

        test('MobX: auto', () => autorun(() => {
          mobxColorA.get()
          mobxColorA.get()
        }))
      })

      describe('Create Compute subscription', () => {
        const wsColor = new State('red')
        const mobxColor = observable.box('red')
        const effectorStore = createEffectorStore(0)
        const nanoColor = atom('red')
        const jotaiColor = jotai('red')

        const jotaiStore = createJotaiStore()

        const reduxStore = createStore((state = { color: 'red' }) => state)
        const selectColor = (state: any) => state.color

        const reduxComputed = createSelector([selectColor], (color) => color)

        const wsComputed = new Compute(() => wsColor.value)
        const mobxComputed1 = computed(() => mobxColor.get())
        const mobxComputed2 = computed(() => mobxColor.get())
        const effectorComputed = effectorStore.map(state => state)
        const nsComputed = nanoComputed(nanoColor, value => value)
        const jotaiComputed = jotai(get => get(jotaiColor))
        const mazzardStore = mazzard({ count: 0, get computed () { return this.count } })

        test('watch-state', () => wsComputed.subscribe(() => {}))
        test('watch-state: auto', () => new Watch(() => wsComputed.value))
        test('MobX: autorun', () => autorun(() => mobxComputed1.get()))
        test('MobX: reaction', () => reaction(() => mobxComputed2.get(), () => {}))
        test('Effector', () => effectorComputed.subscribe(() => {}))
        test('Nano Stores', () => nsComputed.subscribe(() => {}))
        test('Jotai', () => jotaiStore.sub(jotaiComputed, () => {}))
        test('Mazzard', () => mazzard(() => mazzardStore.computed))

        test('Redux (Reselect)', () => reduxStore.subscribe(() => {
          reduxComputed(reduxStore.getState())
        }))
      })

      describe('Create Compute subscription + unsubscribe', () => {
        const wsColor = new State('red')
        const mobxColor = observable.box('red')
        const effectorStore = createEffectorStore(0)
        const nanoColor = atom('red')
        const jotaiColor = jotai('red')

        const jotaiStore = createJotaiStore()

        const reduxStore = createStore((state = { color: 'red' }) => state)
        const selectColor = (state: any) => state.color

        const reduxComputed = createSelector([selectColor], (color) => color)

        const wsComputed = new Compute(() => wsColor.value)
        const mobxComputed1 = computed(() => mobxColor.get())
        const mobxComputed2 = computed(() => mobxColor.get())
        const effectorComputed = effectorStore.map(state => state)
        const nsComputed = nanoComputed(nanoColor, value => value)
        const jotaiComputed = jotai(get => get(jotaiColor))
        const mazzardStore = mazzard({ count: 0, get computed () { return this.count } })

        test('watch-state', () => wsComputed.subscribe(() => {})())
        test('watch-state: auto', () => new Watch(() => wsComputed.value).destroy())
        test('MobX: autorun', () => autorun(() => mobxComputed1.get())())
        test('MobX: reaction', () => reaction(() => mobxComputed2.get(), () => {})())
        test('Effector', () => effectorComputed.subscribe(() => {})())
        test('Nano Stores', () => nsComputed.subscribe(() => {})())
        test('Jotai', () => jotaiStore.sub(jotaiComputed, () => {})())

        test('Mazzard', () => mazzard((stop: () => void) => {
          stop()

          return mazzardStore.computed
        }))

        test('Redux (Reselect)', () => reduxStore.subscribe(() => {
          reduxComputed(reduxStore.getState())
        })())
      })

      describe('Duplicate Compute subscription', () => {
        const wsColor = new State('red')
        const wsaColor = new State('red')
        const mobxColor = observable.box('red')
        const mobxColorA = observable.box('red')
        const effectorStore = createEffectorStore(0)
        const nanoColor = atom('red')
        const jotaiColor = jotai('red')

        const jotaiStore = createJotaiStore()

        const wsComputed = new Compute(() => wsColor.value)
        const wsaComputed = new Compute(() => wsaColor.value)
        const mobxComputed = computed(() => mobxColor.get())
        const mobxComputedA = computed(() => mobxColorA.get())
        const effectorComputed = effectorStore.map(state => state)
        const nsComputed = nanoComputed(nanoColor, value => value)
        const jotaiComputed = jotai(get => get(jotaiColor))

        const mazzardStore = mazzard({ count: 0, get computed () { return this.count } })

        const listener = () => {}

        test('watch-state', () => wsComputed.subscribe(listener))

        test('watch-state: auto', () => new Watch(() => {
          wsaComputed.get()
          wsaComputed.get()
        }))

        test('MobX', () => reaction(() => mobxComputed.get(), listener))

        test('MobX: auto', () => autorun(() => {
          mobxComputedA.get()
          mobxComputedA.get()
        }))

        test('Effector', () => effectorComputed.subscribe(listener))
        test('Nano Stores', () => nsComputed.subscribe(listener))
        test('Jotai', () => jotaiStore.sub(jotaiComputed, listener))

        test('Mazzard', () => mazzard(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          mazzardStore.computed
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          mazzardStore.computed
        }))
      })
    })
  })

  describe('Working', () => {
    describe('Update unwatched State', () => {
      const ws = new State(0)
      const nano = atom(0)
      const stateMobx = observable.box(0)
      const jotaiAtom = jotai(0)
      const jotaiStore = createJotaiStore()
      const mazzardStore = mazzard({ count: 0 })
      const incrementEffector = createEffectorEvent()
      createEffectorStore(0).on(incrementEffector, state => state + 1)

      const storeon = createStoreon([
        s => {
          s.on('@init', () => ({ c: 0 }))
          s.on('inc', (state: any) => ({ c: state.c + 1 }))
        },
      ])

      function reducer (state: any, action: any) {
        if (action.type === 'inc') {
          return { ...state, count: state.count + 1 }
        }

        return state
      }

      const reduxStore = createStore(reducer, { count: 0 })

      test('watch-state', () => ws.value++)
      test('MobX', () => stateMobx.set(stateMobx.get() + 1))
      test('Nano Stores', () => nano.set(nano.get() + 1))
      test('Jotai', () => jotaiStore.set(jotaiAtom, (c) => c + 1))
      test('Storeon', () => storeon.dispatch('inc'))
      test('Effector', () => incrementEffector())
      test('Redux', () => reduxStore.dispatch({ type: 'inc' }))
      test('Mazzard', () => mazzardStore.count++)
    })

    describe('Update watched State', () => {
      const state = new State(0)
      const ws = new State(0)
      const nano = atom(0)
      const stateMobx1 = observable.box(0)
      const stateMobx2 = observable.box(0)
      const increment = createEffectorEvent()
      const store = createEffectorStore(0).on(increment, state => state + 1)
      const mazzardStore = mazzard({ count: 0 })

      const jotaiAtom = jotai(0)
      const jotaiStore = createJotaiStore()

      const storeon = createStoreon([
        s => {
          s.on('@init', () => ({ c: 0 }))
          s.on('inc', (state: any) => ({ c: state.c + 1 }))
        },
      ])

      function reducer (state: any, action: any) {
        if (action.type === 'inc') {
          return { ...state, count: state.count + 1 }
        }

        return state
      }

      const reduxStore = createStore(reducer, { count: 0 })

      new Watch(() => state.value)
      autorun(() => stateMobx1.get())
      reaction(() => stateMobx2.get(), () => {})
      store.watch(() => {})
      nano.subscribe(() => {})
      ws.subscribe(() => {})
      jotaiStore.sub(jotaiAtom, () => {})
      storeon.on('@changed', () => {})
      reduxStore.subscribe(() => {})
      mazzard(() => mazzardStore.count)

      test('watch-state', () => ws.value++)
      test('watch-state: auto', () => state.value++)
      test('MobX: autorun', () => stateMobx1.set(stateMobx1.get() + 1))
      test('MobX: reaction', () => stateMobx2.set(stateMobx2.get() + 1))
      test('Effector', () => increment())
      test('Nano Stores', () => nano.set(nano.get() + 1))
      test('Jotai', () => jotaiStore.set(jotaiAtom, (c) => c + 1))
      test('Storeon', () => storeon.dispatch('inc'))
      test('Redux', () => reduxStore.dispatch({ type: 'inc' }))
      test('Mazzard', () => mazzardStore.count++)
    })

    describe('Batching', () => {
      describe('without batching x10', () => {
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

      describe('with batching x10', () => {
        const state1 = new State(0)
        const state2 = observable.box(0)
        const watcher1 = new Watch(() => state1.value)
        const watcher2 = autorun(() => state2.get())

        const event1 = () => batch(() => {
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

    describe('update watched value', () => {
      // watch-state
      const ws = new State(0)
      ws.subscribe(() => {})

      // watch-state: auto-subscribe
      const WSState = new State(0)
      const watcher = new Watch(() => WSState.value)

      // mobx
      const MXState = observable.box(0)
      const disposer = autorun(() => MXState.get())

      // redux
      function reducer (state: any, action: any) {
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
      const count = (store: any) => {
        store.on('@init', () => ({ count: 0 }))
        store.on('inc', ({ count }: any) => ({ count: count + 1 }))
      }

      const SStore = createStoreon<any>([count])

      const SDispatch = SStore.on('inc', ({ count }) => count)

      test('watch-state', () => {
        ws.value++
      })

      test('watch-state: auto-subscribe', () => {
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
        const log: number[] = []
        const state = new State(COUNT)

        log.push(state.value)

        state.subscribe(() => {
          log.push(state.value)
        })

        while (state.value--) { /* empty */ }

        testLog(log)
      })

      test('watch-state: auto-subscribe', () => {
        const log: number[] = []
        const state = new State(COUNT)
        const watcher = new Watch(() => log.push(state.value))

        while (state.value--) { /* empty */ }

        testLog(log)
        watcher.destroy()
      })

      test('mobx', () => {
        const log: number[] = []
        const state = observable.box(COUNT)
        const disposer = autorun(() => log.push(state.get()))

        while (state.get()) {
          state.set(state.get() - 1)
        }

        testLog(log)
        disposer()
      })

      test('redux', () => {
        const log: number[] = []

        function reducer (state: any, action: any) {
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
        const log: number[] = []
        const store = mazzard({ value: COUNT })
        const stop = mazzard(() => log.push(store.value))

        while (store.value--) { /* empty */ }

        testLog(log)
        stop()
      })

      test('effector', () => {
        const log: number[] = []
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

        const count = (store: any) => {
          store.on('@init', () => ({ count: COUNT }))
          store.on('dec', ({ count }: any) => ({ count: count - 1 }))
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

    describe('counters', () => {
      const COUNT = 100
      const COUNTERS_COUNT = 100

      const counters = [...Array(COUNTERS_COUNT)]

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
        const logs: number[][] = counters.map(() => [])
        const states = counters.map(() => new State(COUNT))

        states.forEach((state, i) => {
          logs[i].push(state.value)
          state.subscribe(() => logs[i].push(state.value))
        })

        for (const state of states) {
          while (state.value--) { /* empty */ }
        }

        logs.forEach(testLog)
      })

      test('watch-state: auto-subscribe', () => {
        const logs: number[][] = counters.map(() => [])
        const states = counters.map(() => new State(COUNT))
        const watchers = states.map((state, i) => new Watch(() => logs[i].push(state.value)))

        for (const state of states) {
          while (state.value--) { /* empty */ }
        }

        logs.forEach(testLog)
        watchers.forEach(watcher => watcher.destroy())
      })

      test('nanostores', () => {
        const logs: number[][] = counters.map(() => [])
        const states = counters.map(() => atom(COUNT))
        const watchers = states.map((state, i) => state.subscribe((value) => logs[i].push(value)))

        for (const state of states) {
          while (state.get()) {
            state.set(state.get() - 1)
          }
        }

        logs.forEach(testLog)
        watchers.forEach(destroy => destroy())
      })

      test('mobx', () => {
        const logs: number[][] = counters.map(() => [])
        const states = counters.map(() => observable.box(COUNT))
        const disposers = states.map((state, i) => autorun(() => logs[i].push(state.get())))

        for (const state of states) {
          while (state.get()) {
            state.set(state.get() - 1)
          }
        }

        logs.forEach(testLog)
        disposers.forEach(disposer => disposer())
      })

      test('redux', () => {
        const logs: number[][] = counters.map(() => [])

        function reducer (state: any, action: any) {
          if (action.type === 'DECREMENT') {
            const key = `count${action.payload}`

            return {
              ...state,
              [key]: state[key] - 1,
            }
          }

          return state
        }

        const store = createStore(reducer, counters.reduce((v, _, i) => ({ ...v, [`count${i}`]: COUNT }), {}))

        for (let i = 0; i < counters.length; i++) {
          logs[i].push(store.getState()[`count${i}`])
        }

        const destroy = store.subscribe(() => {
          const data = store.getState()

          for (let i = 0; i < counters.length; i++) {
            if (logs[i][logs[i].length - 1] !== data[`count${i}`]) {
              logs[i].push(data[`count${i}`])
            }
          }
        })

        for (let i = 0; i < counters.length; i++) {
          while (store.getState()[`count${i}`]) {
            store.dispatch({ type: 'DECREMENT', payload: i })
          }
        }

        logs.forEach(testLog)

        destroy()
      })

      test('mazzard', () => {
        const logs: number[][] = counters.map(() => [])

        const store = mazzard({
          counts: counters.map(() => COUNT),
        })

        const stops = counters.map((_, index) => mazzard(() => logs[index].push(store.counts[index])))

        for (let i = 0; i < logs.length; i++) {
          while (store.counts[i]--) { /* empty */ }
        }

        logs.forEach(testLog)

        stops.forEach(stop => stop())
      })

      test('effector', () => {
        const logs: number[][] = counters.map(() => [])

        const decrements = counters.map(() => createEffectorEvent())

        const stores = counters.map(
          (_, index) => createEffectorStore(COUNT)
            .on(decrements[index], state => state - 1),
        )

        const subscriptions = stores.map((counter, index) => counter.watch(state => {
          logs[index].push(state)
        }))

        for (let i = 0; i < counters.length; i++) {
          while (stores[i].getState()) {
            decrements[i]()
          }
        }

        logs.forEach(testLog)

        subscriptions.forEach(subscription => {
          subscription.unsubscribe()
        })
      })

      test('storeon', () => {
        const logs: number[][] = counters.map(() => [])

        const modules = counters.map((_, index) => (store: any) => {
          store.on('@init', () => ({ [`count${index}`]: COUNT }))
          store.on(`dec${index}`, (store: any) => ({ [`count${index}`]: store[`count${index}`] - 1 }))
        })

        const store = createStoreon<any>(modules)

        counters.forEach((_, index) => {
          logs[index].push(store.get()[`count${index}`])
        })

        const dispatches = counters.map((_, index) => store.on(`dec${index}`, store => {
          logs[index].push(store[`count${index}`])
        }))

        for (let i = 0; i < counters.length; i++) {
          while (store.get()[`count${i}`]) {
            store.dispatch(`dec${i}`)
          }
        }

        logs.forEach(testLog)

        dispatches.forEach(dispatch => {
          dispatch()
        })
      })
    })

    describe('unused computed', () => {
      const COUNT = 100
      const COUNTERS_COUNT = 100

      const counters = [...Array(COUNTERS_COUNT)]

      test('watch-state', () => {
        const states = counters.map(() => new State(COUNT))
        states.map((state) => new Compute(() => state.value))

        for (const state of states) {
          while (state.value--) { /* empty */ }
        }
      })

      test('nanostores', () => {
        const states = counters.map(() => atom(COUNT))
        states.map((state) => nanoComputed(state, value => value))

        for (const state of states) {
          while (state.get()) {
            state.set(state.get() - 1)
          }
        }
      })

      test('mobx', () => {
        const states = counters.map(() => observable.box(COUNT))
        states.map((state) => computed(() => state.get()))

        for (const state of states) {
          while (state.get()) {
            state.set(state.get() - 1)
          }
        }
      })
    })
  })
}, 300)
