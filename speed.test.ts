import { clearNode, createEvent as createEffectorEvent, createStore as createEffectorStore } from 'effector'
import { atom as jotai, createStore as createJotaiStore } from 'jotai/vanilla'
// @ts-expect-error Mazzard does not support TypeScript
import mazzard, { action as mazzardAction } from 'mazzard'
import { action, autorun, computed, configure, observable, reaction } from 'mobx'
import { atom, computed as nanoComputed } from 'nanostores'
import { describe, perfocode, test } from 'perfocode'
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
    describe('Create a State', () => {
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

    describe('Create a Compute', () => {
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

    describe('Create bound Compute', () => {
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

    describe('Create a Compute + destroy', () => {
      const wsState = new State(null)
      const effectorStore = createEffectorStore(null)

      test('watch-state', () => new Compute(() => {}).destroy())
      test('watch-state: bound', () => new Compute(() => wsState.value).destroy())
      test('Effector', () => clearNode(effectorStore.map(state => state)))
    })

    describe('Subscription', () => {
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

        test('watch-state', () => wsColor.on(() => {}))
        test('watch-state: auto', () => new Watch(() => wsColorAuto.value))
        test('MobX: autorun', () => autorun(() => mobxColor1.get()))
        test('MobX: reaction', () => reaction(() => mobxColor2.get(), () => {}))
        test('Effector', () => effectorStore.watch(() => {}))
        test('Nano Stores', () => nanoColor.subscribe(() => {}))
        test('Jotai', () => jotaiStore.sub(jotaiColor, () => {}))
        test('Storeon', () => store.on('setColor', () => {}))
        test('Mazzard', () => mazzard(() => mazzardStore.count))
        test('Redux', () => reduxStore.subscribe(() => {}))
      })

      describe('Create State subscription + unsubscribe', () => {
        const wsColor = new State('red')
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

        test('watch-state', () => wsColor.on(() => {})())
        test('watch-state: auto', () => new Watch(() => wsColor.value).destroy())
        test('MobX: autorun', () => autorun(() => mobxColor1.get())())
        test('MobX: reaction', () => reaction(() => mobxColor2.get(), () => {})())
        test('Effector', () => effectorStore.watch(() => {})())
        test('Nano Stores', () => nanoColor.subscribe(() => {})())
        test('Jotai', () => jotaiStore.sub(jotaiColor, () => {})())
        test('Storeon', () => store.on('setColor', () => {})())
        test('Mazzard', () => mazzard(() => mazzardStore.count)())
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

        test('watch-state', () => wsColor.on(listener))

        test('watch-state: auto', () => new Watch(() => {
          wsaColor.get()
          wsaColor.get()
        }))

        test('Effector', () => messageEvent.watch(listener))
        test('Nano Stores', () => nanoColor.subscribe(listener))
        test('Jotai', () => jotaiStore.sub(jotaiColor, listener))
        test('Storeon', () => store.on('setColor', listener))
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

        test('watch-state', () => wsComputed.on(() => {}))
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

        const wsComputed = new Compute(() => wsColor.value)
        const mobxComputed1 = computed(() => mobxColor.get())
        const mobxComputed2 = computed(() => mobxColor.get())
        const effectorComputed = effectorStore.map(state => state)
        const nsComputed = nanoComputed(nanoColor, value => value)
        const jotaiComputed = jotai(get => get(jotaiColor))
        const mazzardStore = mazzard({ count: 0, get computed () { return this.count } })

        test('watch-state', () => wsComputed.on(() => {})())
        test('watch-state: auto', () => new Watch(() => wsComputed.value).destroy())
        test('MobX: autorun', () => autorun(() => mobxComputed1.get())())
        test('MobX: reaction', () => reaction(() => mobxComputed2.get(), () => {})())
        test('Effector', () => effectorComputed.subscribe(() => {})())
        test('Nano Stores', () => nsComputed.subscribe(() => {})())
        test('Jotai', () => jotaiStore.sub(jotaiComputed, () => {})())
        test('Mazzard', () => mazzard(() => mazzardStore.computed)())
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

        test('watch-state', () => wsComputed.on(listener))

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

  describe('Updating', () => {
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

      const watcher = new Watch(() => state.value)
      const unwatch1 = ws.on(() => {})
      const unwatch2 = autorun(() => stateMobx1.get())
      const unwatch3 = reaction(() => stateMobx2.get(), () => {})
      const unwatch4 = store.watch(() => {})
      const unwatch5 = nano.subscribe(() => {})
      const unwatch6 = jotaiStore.sub(jotaiAtom, () => {})
      const unwatch7 = storeon.on('inc', () => {})
      const unwatch8 = reduxStore.subscribe(() => {})
      const unwatch9 = mazzard(() => mazzardStore.count)

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

      watcher.destroy()
      unwatch1()
      unwatch2()
      unwatch3()
      unwatch4()
      unwatch5()
      unwatch6()
      unwatch7()
      unwatch8()
      unwatch9()
    })

    describe('Update unwatched Compute', () => {
      const wsState = new State(0)
      const mobxState = observable.box(0)
      const mazzardState = mazzard({ count: 0, get computed () { return this.count } })
      const nanoState = atom(0)
      const jotaiAtom = jotai(0)
      const jotaiStore = createJotaiStore()
      const incrementEffector = createEffectorEvent()
      const effectorStore = createEffectorStore(0).on(incrementEffector, s => s + 1)

      const storeon = createStoreon([
        s => {
          s.on('@init', () => ({ c: 0 }))
          s.on('inc', (state: any) => ({ c: state.c + 1 }))
        },
      ])

      const reduxStore = createStore((s: number = 0, a) =>
        a.type === 'inc' ? s + 1 : s,
      )

      const mazzardEvent = () => {
        mazzardState.count++
      }

      const wsAction = () => {
        wsState.value++
      }

      const mobxAction = () => {
        mobxState.set(mobxState.get() + 1)
      }

      const nanoAction = () => {
        nanoState.set(nanoState.get() + 1)
      }

      const jotaiAction = () => {
        jotaiStore.set(jotaiAtom, c => c + 1)
      }

      const effectorAction = () => {
        incrementEffector()
      }

      const reduxAction = () => {
        reduxStore.dispatch({ type: 'inc' })
      }

      const storeonAction = () => {
        storeon.dispatch('inc')
      }

      const wsCompute = new Compute(() => wsState.value)
      computed(() => mobxState.get())
      nanoComputed(nanoState, value => value)
      jotai(get => get(jotaiAtom))
      effectorStore.map(value => value)

      test('watch-state', () => wsAction())
      test('MobX', () => mobxAction())
      test('Mazzard', () => mazzardEvent())
      test('Nano Stores', () => nanoAction())
      test('Jotai', () => jotaiAction())
      test('Effector', () => effectorAction())
      test('Redux (Reselect)', () => reduxAction())
      test('Storeon', () => storeonAction())
      wsCompute.destroy()
    })

    describe('Update watched Compute', () => {
      const wsState = new State(0)
      const mobxState = observable.box(0)
      const mazzardState = mazzard({ count: 0, get computed () { return this.count } })
      const nanoState = atom(0)
      const jotaiAtom = jotai(0)
      const jotaiStore = createJotaiStore()
      const incrementEffector = createEffectorEvent()
      const effectorStore = createEffectorStore(0).on(incrementEffector, s => s + 1)

      const storeon = createStoreon([
        s => {
          s.on('@init', () => ({ c: 0 }))
          s.on('inc', (state: any) => ({ c: state.c + 1 }))
        },
      ])

      const reduxStore = createStore((s: number = 0, a) =>
        a.type === 'inc' ? s + 1 : s,
      )

      const reduxSelector = createSelector(
        (state) => state.c,
        (c) => c + 1,
      )

      const mazzardEvent = () => {
        mazzardState.count++
      }

      const wsAction = () => {
        wsState.value++
      }

      const mobxAction = () => {
        mobxState.set(mobxState.get() + 1)
      }

      const nanoAction = () => {
        nanoState.set(nanoState.get() + 1)
      }

      const jotaiAction = () => {
        jotaiStore.set(jotaiAtom, c => c + 1)
      }

      const effectorAction = () => {
        incrementEffector()
      }

      const reduxAction = () => {
        reduxStore.dispatch({ type: 'inc' })
      }

      const storeonAction = () => {
        storeon.dispatch('inc')
      }

      const wsCompute = new Compute(() => wsState.value)
      const mobxCompute = computed(() => mobxState.get())
      const nanoCompute = nanoComputed(nanoState, value => value)
      const jotaiCompute = jotai(get => get(jotaiAtom))
      const effectorCompute = effectorStore.map(value => value)

      const unwatch1 = wsCompute.on(() => {})
      const unwatch2 = autorun(() => mobxCompute.get())
      const unwatch3 = mazzard(() => mazzardState.computed)
      const unwatch4 = nanoCompute.subscribe(() => {})
      const unwatch5 = jotaiStore.sub(jotaiCompute, () => {})
      const unwatch6 = effectorCompute.watch(() => {})
      const unwatch7 = storeon.on('inc', () => {})

      const unwatch8 = reduxStore.subscribe(() => {
        reduxSelector(reduxStore.getState())
      })

      test('watch-state', () => wsAction())
      test('MobX', () => mobxAction())
      test('Mazzard', () => mazzardEvent())
      test('Nano Stores', () => nanoAction())
      test('Jotai', () => jotaiAction())
      test('Effector', () => effectorAction())
      test('Redux (Reselect)', () => reduxAction())
      test('Storeon', () => storeonAction())

      wsCompute.destroy()
      unwatch1()
      unwatch2()
      unwatch3()
      unwatch4()
      unwatch5()
      unwatch6()
      unwatch7()
      unwatch8()
    })

    describe('Update memo Compute', () => {
      const wsState = new State(0)
      const mobxState = observable.box(0)
      const mazzardState = mazzard({ count: 0, get computed () { return this.count } })
      const nanoState = atom(0)
      const jotaiAtom = jotai(0)
      const jotaiStore = createJotaiStore()
      const incrementEffector = createEffectorEvent()
      const effectorStore = createEffectorStore(0).on(incrementEffector, s => s + 1)

      const storeon = createStoreon([
        s => {
          s.on('@init', () => ({ c: 0 }))
          s.on('inc', (state: any) => ({ c: state.c + 1 }))
        },
      ])

      const reduxStore = createStore((s: number = 0, a) =>
        a.type === 'inc' ? s + 1 : s,
      )

      const reduxSelector = createSelector(
        (state) => state.c,
        (c) => c > 0,
      )

      const mazzardEvent = () => {
        mazzardState.count++
      }

      const wsAction = () => {
        wsState.value++
      }

      const mobxAction = () => {
        mobxState.set(mobxState.get() + 1)
      }

      const nanoAction = () => {
        nanoState.set(nanoState.get() + 1)
      }

      const jotaiAction = () => {
        jotaiStore.set(jotaiAtom, c => c + 1)
      }

      const effectorAction = () => {
        incrementEffector()
      }

      const reduxAction = () => {
        reduxStore.dispatch({ type: 'inc' })
      }

      const storeonAction = () => {
        storeon.dispatch('inc')
      }

      const wsCompute = new Compute(() => wsState.value > 0)
      const mobxCompute = computed(() => mobxState.get() > 0)
      const nanoCompute = nanoComputed(nanoState, value => value > 0)
      const jotaiCompute = jotai(get => get(jotaiAtom) > 0)
      const effectorCompute = effectorStore.map(value => value > 0)

      const unwatch1 = wsCompute.on(() => {})
      const unwatch2 = autorun(() => mobxCompute.get())
      const unwatch3 = mazzard(() => mazzardState.computed)
      const unwatch4 = nanoCompute.subscribe(() => {})
      const unwatch5 = jotaiStore.sub(jotaiCompute, () => {})
      const unwatch6 = effectorCompute.watch(() => {})
      const unwatch7 = storeon.on('inc', () => {})

      const unwatch8 = reduxStore.subscribe(() => {
        reduxSelector(reduxStore.getState())
      })

      test('watch-state', () => wsAction())
      test('MobX', () => mobxAction())
      test('Mazzard', () => mazzardEvent())
      test('Nano Stores', () => nanoAction())
      test('Jotai', () => jotaiAction())
      test('Effector', () => effectorAction())
      test('Redux (Reselect)', () => reduxAction())
      test('Storeon', () => storeonAction())

      wsCompute.destroy()
      unwatch1()
      unwatch2()
      unwatch3()
      unwatch4()
      unwatch5()
      unwatch6()
      unwatch7()
      unwatch8()
    })
  })

  describe('Batching', () => {
    describe('Batching with State', () => {
      const wsState = new State(0)
      const mobxState = observable.box(0)
      const mazzardState = mazzard({ count: 0 })
      const nanoState = atom(0)
      const jotaiAtom = jotai(0)
      const jotaiStore = createJotaiStore()
      const incrementEffector = createEffectorEvent()
      const effectorStore = createEffectorStore(0).on(incrementEffector, s => s + 1)

      const reduxStore = createStore((s: number = 0, a) => a.type === 'inc' ? s + 1 : s)

      const storeon = createStoreon([store => {
        store.on('@init', () => ({ count: 0 }))
        store.on('inc', (state: any) => ({ count: state.count + 1 }))
      }])

      const mazzardEvent = mazzardAction(() => {
        for (let i = 0; i < 10; i++) {
          mazzardState.count++
        }
      })

      const wsAction = () => batch(() => {
        for (let i = 0; i < 10; i++) {
          wsState.value++
        }
      })

      const mobxAction = action(() => {
        for (let i = 0; i < 10; i++) {
          mobxState.set(mobxState.get() + 1)
        }
      })

      const nanoAction = () => {
        for (let i = 0; i < 10; i++) {
          nanoState.set(nanoState.get() + 1)
        }
      }

      const jotaiAction = () => {
        for (let i = 0; i < 10; i++) {
          jotaiStore.set(jotaiAtom, c => c + 1)
        }
      }

      const effectorAction = () => {
        for (let i = 0; i < 10; i++) {
          incrementEffector()
        }
      }

      const reduxAction = () => {
        for (let i = 0; i < 10; i++) {
          reduxStore.dispatch({ type: 'inc' })
        }
      }

      const storeonAction = () => {
        for (let i = 0; i < 10; i++) storeon.dispatch('inc')
      }

      const unwatch1 = wsState.on(() => {})
      const unwatch2 = autorun(() => mobxState.get())
      const unwatch3 = mazzard(() => mazzardState.count)
      const unwatch4 = nanoState.subscribe(() => {})
      const unwatch5 = jotaiStore.sub(jotaiAtom, () => {})
      const unwatch6 = effectorStore.watch(() => {})
      const unwatch7 = reduxStore.subscribe(() => {})
      const unwatch8 = storeon.on('inc', () => {})

      test('watch-state', () => wsAction())
      test('MobX', () => mobxAction())
      test('Mazzard', () => mazzardEvent())
      test('Nano Stores', () => nanoAction())
      test('Jotai', () => jotaiAction())
      test('Effector', () => effectorAction())
      test('Redux', () => reduxAction())
      test('Storeon', () => storeonAction())

      unwatch1()
      unwatch2()
      unwatch3()
      unwatch4()
      unwatch5()
      unwatch6()
      unwatch7()
      unwatch8()
    })

    describe('Batching with unwatched State', () => {
      const wsState = new State(0)
      const mobxState = observable.box(0)
      const mazzardState = mazzard({ count: 0 })
      const nanoState = atom(0)
      const jotaiAtom = jotai(0)
      const jotaiStore = createJotaiStore()
      const incrementEffector = createEffectorEvent()
      createEffectorStore(0).on(incrementEffector, s => s + 1)

      const reduxStore = createStore((s: number = 0, a) => a.type === 'inc' ? s + 1 : s)

      const storeon = createStoreon([store => {
        store.on('@init', () => ({ count: 0 }))
        store.on('inc', (state: any) => ({ count: state.count + 1 }))
      }])

      const mazzardEvent = mazzardAction(() => {
        for (let i = 0; i < 10; i++) {
          mazzardState.count++
        }
      })

      const wsAction = () => batch(() => {
        for (let i = 0; i < 10; i++) {
          wsState.value++
        }
      })

      const mobxAction = action(() => {
        for (let i = 0; i < 10; i++) {
          mobxState.set(mobxState.get() + 1)
        }
      })

      const nanoAction = () => {
        for (let i = 0; i < 10; i++) {
          nanoState.set(nanoState.get() + 1)
        }
      }

      const jotaiAction = () => {
        for (let i = 0; i < 10; i++) {
          jotaiStore.set(jotaiAtom, c => c + 1)
        }
      }

      const effectorAction = () => {
        for (let i = 0; i < 10; i++) {
          incrementEffector()
        }
      }

      const reduxAction = () => {
        for (let i = 0; i < 10; i++) {
          reduxStore.dispatch({ type: 'inc' })
        }
      }

      const storeonAction = () => {
        for (let i = 0; i < 10; i++) storeon.dispatch('inc')
      }

      test('watch-state', () => wsAction())
      test('MobX', () => mobxAction())
      test('Mazzard', () => mazzardEvent())
      test('Nano Stores', () => nanoAction())
      test('Jotai', () => jotaiAction())
      test('Effector', () => effectorAction())
      test('Redux', () => reduxAction())
      test('Storeon', () => storeonAction())
    })

    describe('Batching with Compute', () => {
      const wsState = new State(0)
      const mobxState = observable.box(0)
      const mazzardState = mazzard({ count: 0, get computed () { return this.count } })
      const nanoState = atom(0)
      const jotaiAtom = jotai(0)
      const jotaiStore = createJotaiStore()
      const incrementEffector = createEffectorEvent()
      const effectorStore = createEffectorStore(0).on(incrementEffector, s => s + 1)

      const storeon = createStoreon([
        s => {
          s.on('@init', () => ({ c: 0 }))
          s.on('inc', (state: any) => ({ c: state.c + 1 }))
        },
      ])

      const reduxStore = createStore((s: number = 0, a) =>
        a.type === 'inc' ? s + 1 : s,
      )

      const reduxSelector = createSelector(
        (state) => state.c,
        (c) => c + 1,
      )

      const mazzardEvent = mazzardAction(() => {
        for (let i = 0; i < 10; i++) {
          mazzardState.count++
        }
      })

      const wsAction = () => batch(() => {
        for (let i = 0; i < 10; i++) {
          wsState.value++
        }
      })

      const mobxAction = action(() => {
        for (let i = 0; i < 10; i++) {
          mobxState.set(mobxState.get() + 1)
        }
      })

      const nanoAction = () => {
        for (let i = 0; i < 10; i++) {
          nanoState.set(nanoState.get() + 1)
        }
      }

      const jotaiAction = () => {
        for (let i = 0; i < 10; i++) {
          jotaiStore.set(jotaiAtom, c => c + 1)
        }
      }

      const effectorAction = () => {
        for (let i = 0; i < 10; i++) {
          incrementEffector()
        }
      }

      const reduxAction = () => {
        for (let i = 0; i < 10; i++) reduxStore.dispatch({ type: 'inc' })
      }

      const storeonAction = () => {
        for (let i = 0; i < 10; i++) storeon.dispatch('inc')
      }

      const wsCompute = new Compute(() => wsState.value)
      const mobxCompute = computed(() => mobxState.get())
      const nanoCompute = nanoComputed(nanoState, value => value)
      const jotaiCompute = jotai(get => get(jotaiAtom))
      const effectorCompute = effectorStore.map(value => value)

      const unwatch1 = wsCompute.on(() => {})
      const unwatch2 = autorun(() => mobxCompute.get())
      const unwatch3 = mazzard(() => mazzardState.computed)
      const unwatch4 = nanoCompute.subscribe(() => {})
      const unwatch5 = jotaiStore.sub(jotaiCompute, () => {})
      const unwatch6 = effectorCompute.watch(() => {})
      const unwatch7 = storeon.on('inc', () => {})

      const unwatch8 = reduxStore.subscribe(() => {
        reduxSelector(reduxStore.getState())
      })

      test('watch-state', () => wsAction())
      test('MobX', () => mobxAction())
      test('Mazzard', () => mazzardEvent())
      test('Nano Stores', () => nanoAction())
      test('Jotai', () => jotaiAction())
      test('Effector', () => effectorAction())
      test('Redux (Reselect)', () => reduxAction())
      test('Storeon', () => storeonAction())

      wsCompute.destroy()
      unwatch1()
      unwatch2()
      unwatch3()
      unwatch4()
      unwatch5()
      unwatch6()
      unwatch7()
      unwatch8()
    })

    describe('Batching with unwatched Compute', () => {
      const wsState = new State(0)
      const mobxState = observable.box(0)
      const mazzardState = mazzard({ count: 0, get computed () { return this.count } })
      const nanoState = atom(0)
      const jotaiAtom = jotai(0)
      const jotaiStore = createJotaiStore()
      const incrementEffector = createEffectorEvent()
      const effectorStore = createEffectorStore(0).on(incrementEffector, s => s + 1)

      const storeon = createStoreon([
        s => {
          s.on('@init', () => ({ c: 0 }))
          s.on('inc', (state: any) => ({ c: state.c + 1 }))
        },
      ])

      const mazzardEvent = mazzardAction(() => {
        for (let i = 0; i < 10; i++) {
          mazzardState.count++
        }
      })

      const wsAction = () => batch(() => {
        for (let i = 0; i < 10; i++) {
          wsState.value++
        }
      })

      const mobxAction = action(() => {
        for (let i = 0; i < 10; i++) {
          mobxState.set(mobxState.get() + 1)
        }
      })

      const nanoAction = () => {
        for (let i = 0; i < 10; i++) {
          nanoState.set(nanoState.get() + 1)
        }
      }

      const jotaiAction = () => {
        for (let i = 0; i < 10; i++) {
          jotaiStore.set(jotaiAtom, c => c + 1)
        }
      }

      const effectorAction = () => {
        for (let i = 0; i < 10; i++) {
          incrementEffector()
        }
      }

      const storeonAction = () => {
        for (let i = 0; i < 10; i++) storeon.dispatch('inc')
      }

      const wsCompute = new Compute(() => wsState.value)
      computed(() => mobxState.get())
      nanoComputed(nanoState, value => value)
      jotai(get => get(jotaiAtom))
      effectorStore.map(value => value)

      test('watch-state', () => wsAction())
      test('MobX', () => mobxAction())
      test('Mazzard', () => mazzardEvent())
      test('Nano Stores', () => nanoAction())
      test('Jotai', () => jotaiAction())
      test('Effector', () => effectorAction())
      test('Storeon', () => storeonAction())

      wsCompute.destroy()
    })
  })

  describe('Examples', () => {
    describe('Counter', () => {
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

        const unsubscribe = state.on(() => {
          log.push(state.raw)
        })

        while (state.value--) { /* empty */ }

        testLog(log)
        unsubscribe()
      })

      test('watch-state: auto', () => {
        const log: number[] = []
        const state = new State(COUNT)
        const watcher = new Watch(() => log.push(state.value))

        while (state.value--) { /* empty */ }

        testLog(log)
        watcher.destroy()
      })

      test('MobX', () => {
        const log: number[] = []
        const state = observable.box(COUNT)
        const disposer = autorun(() => log.push(state.get()))

        while (state.get()) {
          state.set(state.get() - 1)
        }

        testLog(log)
        disposer()
      })

      test('Redux', () => {
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

      test('Mazzard', () => {
        const log: number[] = []
        const store = mazzard({ value: COUNT })
        const stop = mazzard(() => log.push(store.value))

        while (store.value--) { /* empty */ }

        testLog(log)
        stop()
      })

      test('Effector', () => {
        const log: number[] = []
        const decrement = createEffectorEvent()
        const counter = createEffectorStore(COUNT).on(decrement, state => state - 1)

        const unsubscribe = counter.watch(state => {
          log.push(state)
        })

        while (counter.getState()) {
          decrement()
        }

        testLog(log)
        unsubscribe()
      })

      test('Storeon', () => {
        const log = []

        const count = (store: any) => {
          store.on('@init', () => ({ count: COUNT }))
          store.on('dec', ({ count }: any) => ({ count: count - 1 }))
        }

        const store = createStoreon<any>([count])

        log.push(store.get().count)

        const destroy = store.on('dec', ({ count }) => {
          log.push(count)
        })

        while (store.get().count) {
          store.dispatch('dec')
        }

        testLog(log)
        destroy()
      })

      test('Nano Stores', () => {
        const log: number[] = []
        const counter = atom(COUNT)

        const unsubscribe = counter.subscribe(value => {
          log.push(value)
        })

        while (counter.get()) {
          counter.set(counter.get() - 1)
        }

        testLog(log)
        unsubscribe()
      })

      test('Jotai', () => {
        const log: number[] = []
        const counterAtom = jotai(COUNT)
        const store = createJotaiStore()

        log.push(store.get(counterAtom))

        const unsubscribe = store.sub(counterAtom, () => {
          log.push(store.get(counterAtom))
        })

        while (store.get(counterAtom)) {
          store.set(counterAtom, (c) => c - 1)
        }

        testLog(log)
        unsubscribe()
      })
    })

    describe('Counters', () => {
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

      const testLogs = (logs: number[][]) => {
        if (logs.length !== COUNTERS_COUNT) {
          throw Error(`test failed: logs.length expected: ${COUNTERS_COUNT}, actual: ${logs.length}`)
        }

        logs.forEach(testLog)
      }

      test('watch-state', () => {
        const logs: number[][] = counters.map(() => [])
        const states = counters.map(() => new State(COUNT))

        const destructors = states.map((state, i) => {
          logs[i].push(state.value)

          return state.on(() => logs[i].push(state.raw))
        })

        for (const state of states) {
          while (state.value--) { /* empty */ }
        }

        testLogs(logs)
        destructors.forEach(destroy => destroy())
      })

      test('watch-state: auto', () => {
        const logs: number[][] = counters.map(() => [])
        const states = counters.map(() => new State(COUNT))
        const watchers = states.map((state, i) => new Watch(() => logs[i].push(state.value)))

        for (const state of states) {
          while (state.value--) { /* empty */ }
        }

        testLogs(logs)
        watchers.forEach(watcher => watcher.destroy())
      })

      test('Nano Stores', () => {
        const logs: number[][] = counters.map(() => [])
        const states = counters.map(() => atom(COUNT))
        const watchers = states.map((state, i) => state.subscribe((value) => logs[i].push(value)))

        for (const state of states) {
          while (state.get()) {
            state.set(state.get() - 1)
          }
        }

        testLogs(logs)
        watchers.forEach(destroy => destroy())
      })

      test('MobX', () => {
        const logs: number[][] = counters.map(() => [])
        const states = counters.map(() => observable.box(COUNT))
        const disposers = states.map((state, i) => autorun(() => logs[i].push(state.get())))

        for (const state of states) {
          while (state.get()) {
            state.set(state.get() - 1)
          }
        }

        testLogs(logs)
        disposers.forEach(disposer => disposer())
      })

      test('Redux', () => {
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

        testLogs(logs)
        destroy()
      })

      test('Mazzard', () => {
        const logs: number[][] = counters.map(() => [])

        const store = mazzard({
          counts: counters.map(() => COUNT),
        })

        const stops = counters.map((_, index) => mazzard(() => logs[index].push(store.counts[index])))

        for (let i = 0; i < logs.length; i++) {
          while (store.counts[i]--) { /* empty */ }
        }

        testLogs(logs)
        stops.forEach(stop => stop())
      })

      test('Effector', () => {
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

        testLogs(logs)

        subscriptions.forEach(subscription => {
          subscription.unsubscribe()
        })
      })

      test('Storeon', () => {
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

        testLogs(logs)

        dispatches.forEach(dispatch => {
          dispatch()
        })
      })

      test('Jotai', () => {
        const logs: number[][] = counters.map(() => [])
        const store = createJotaiStore()
        const atoms = counters.map(() => jotai(COUNT))

        const unsubscribers = atoms.map((a, i) => {
          logs[i].push(store.get(a))

          return store.sub(a, () => {
            logs[i].push(store.get(a))
          })
        })

        for (const a of atoms) {
          while (store.get(a)) {
            store.set(a, (c) => c - 1)
          }
        }

        testLogs(logs)
        unsubscribers.forEach(unsub => unsub())
      })
    })
  })
})
