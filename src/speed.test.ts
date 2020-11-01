import watch, {State, Watch, state} from '.'
import Computed, {computed as c} from './Computed'
import {autorun, observable, computed, reaction} from 'mobx'

function perf (callback: () => void, ms = 1000) {
  let count = 0
  const endTime = performance.now() + ms
  do {
    callback()
    count++
  } while (performance.now() < endTime)
  return count / ms
}

describe('watch-state: performance', () => {
  test('empty', () => {
    expect(perf(() => {})).toBeLessThan(3278)
    expect(perf(() => {})).toBeGreaterThan(2425)
  })
  describe('create state', () => {
    test('watch-state: State', () => {
      expect(perf(() => new State())).toBeLessThan(2988)
      expect(perf(() => new State())).toBeGreaterThan(2741)
    })
    test('mobx: observable.box', () => {
      expect(perf(() => observable.box())).toBeLessThan(1303)
      expect(perf(() => observable.box())).toBeGreaterThan(1093)
    })
  })
  describe('empty watch', () => {
    test('watch-state: Watch', () => {
      expect(perf(() => new Watch(() => {}))).toBeLessThan(2918)
      expect(perf(() => new Watch(() => {}))).toBeGreaterThan(2383)
    })
    test('watch-state: watch', () => {
      expect(perf(() => watch(() => {}))).toBeLessThan(2945)
      expect(perf(() => watch(() => {}))).toBeGreaterThan(2325)
    })
    test('mobx: autorun', () => {
      expect(perf(() => autorun(() => {}))).toBeLessThan(936)
      expect(perf(() => autorun(() => {}))).toBeGreaterThan(792)
    })
  })
  describe('watch state', () => {
    test('watch-state', () => {
      const color = new State('red')
      expect(perf(() => watch(() => color.value))).toBeLessThan(918)
      expect(perf(() => watch(() => color.value))).toBeGreaterThan(552)
    })
    test('mobx', () => {
      const color = observable.box('red')
      expect(perf(() => autorun(() => color.get()))).toBeLessThan(450)
      expect(perf(() => autorun(() => color.get()))).toBeGreaterThan(170)
    })
  })
  describe('state decorator', () => {
    describe('one', () => {
      test('watch-state', () => {
        class Color {
          @state value
          constructor (value = 'red') {
            this.value = value
          }
        }
        expect(perf(() => new Color())).toBeLessThan(2669)
        expect(perf(() => new Color())).toBeGreaterThan(2551)
      })
      test('mobx: observable', () => {
        class Color {
          @observable value
          constructor (value = 'red') {
            this.value = value
          }
        }
        expect(perf(() => new Color())).toBeLessThan(218)
        expect(perf(() => new Color())).toBeGreaterThan(197)
      })
      test('mobx: observable.ref', () => {
        class Color {
          @observable.ref value
          constructor (value = 'red') {
            this.value = value
          }
        }
        expect(perf(() => new Color())).toBeLessThan(245)
        expect(perf(() => new Color())).toBeGreaterThan(223)
      })
    })
    describe('one with default', () => {
      test('watch-state', () => {
        class Color {
          @state value = 'black'
          constructor (value = 'red') {
            this.value = value
          }
        }
        expect(perf(() => new Color())).toBeLessThan(1896)
        expect(perf(() => new Color())).toBeGreaterThan(1604)
      })
      test('mobx: observable', () => {
        class Color {
          @observable value = 'black'
          constructor (value = 'red') {
            this.value = value
          }
        }
        expect(perf(() => new Color())).toBeLessThan(201)
        expect(perf(() => new Color())).toBeGreaterThan(172)
      })
      test('mobx: observable.ref', () => {
        class Color {
          @observable.ref value = 'black'
          constructor (value = 'red') {
            this.value = value
          }
        }
        expect(perf(() => new Color())).toBeLessThan(232)
        expect(perf(() => new Color())).toBeGreaterThan(210)
      })
    })
    describe('two', () => {
      test('watch-state', () => {
        class Color {
          @state key
          @state value
          constructor (key = 'test', value = 'red') {
            this.key = key
            this.value = value
          }
        }
        expect(perf(() => new Color())).toBeLessThan(2241)
        expect(perf(() => new Color())).toBeGreaterThan(2092)
      })
      test('mobx: observable', () => {
        class Color {
          @observable key
          @observable value
          constructor (key = 'test', value = 'red') {
            this.key = key
            this.value = value
          }
        }
        expect(perf(() => new Color())).toBeLessThan(158)
        expect(perf(() => new Color())).toBeGreaterThan(141)
      })
      test('mobx: observable.ref', () => {
        class Color {
          @observable.ref key
          @observable.ref value
          constructor (key = 'test', value = 'red') {
            this.key = key
            this.value = value
          }
        }
        expect(perf(() => new Color())).toBeLessThan(187)
        expect(perf(() => new Color())).toBeGreaterThan(163)
      })
    })
  })
  describe('create computed', () => {
    test('watch-state: Computed', () => {
      expect(perf(() => new Computed(() => {}))).toBeLessThan(2776)
      expect(perf(() => new Computed(() => {}))).toBeGreaterThan(2572)
    })
    test('mobx: computed', () => {
      expect(perf(() => computed(() => {}))).toBeLessThan(1408)
      expect(perf(() => computed(() => {}))).toBeGreaterThan(1200)
    })
  })
  describe('computed decorator', () => {
    test('watch-state: computed', () => {
      class User {
        @c get fullName () {
          return ''
        }
      }
      expect(perf(() => new User())).toBeLessThan(3199)
      expect(perf(() => new User())).toBeGreaterThan(2685)
    })
    test('mobx: computed', () => {
      class User {
        @computed get fullName () {
          return ''
        }
      }
      expect(perf(() => new User())).toBeLessThan(3154)
      expect(perf(() => new User())).toBeGreaterThan(2378)
    })
  })
  describe('user', () => {
    describe('computed and state decorators', () => {
      test('watch-state: computed', () => {
        class User {
          @state name = 'Mike'
          @state surname = 'Mighty'
          @c get fullName () {
            return `${this.name} ${this.surname[0]}`
          }
        }
        expect(perf(() => new User())).toBeLessThan(2291)
        expect(perf(() => new User())).toBeGreaterThan(2197)
      })
      test('mobx: computed', () => {
        class User {
          @observable.ref name = 'Mike'
          @observable.ref surname = 'Mighty'
          @computed get fullName () {
            return `${this.name} ${this.surname[0]}`
          }
        }
        expect(perf(() => new User())).toBeLessThan(154)
        expect(perf(() => new User())).toBeGreaterThan(85)
      })
    })
  })
  describe('update', () => {
    test('watch-state', () => {
      const state = new State(0)
      watch(() => state.value)
      expect(perf(() => state.value++)).toBeLessThan(1595)
      state.value = 0
      expect(perf(() => state.value++)).toBeGreaterThan(904)
    })
    test('mobx:autorun', () => {
      const state = observable.box(0)
      autorun(() => state.get())
      expect(perf(() => state.set(state.get() + 1))).toBeLessThan(756)
      state.set(0)
      expect(perf(() => state.set(state.get() + 1))).toBeGreaterThan(702)
    })
    test('mobx:reaction', () => {
      const state = observable.box(0)
      reaction(() => state.get(), () => {})
      expect(perf(() => state.set(state.get() + 1))).toBeLessThan(756)
      state.set(0)
      expect(perf(() => state.set(state.get() + 1))).toBeGreaterThan(674)
    })
  })
  describe('complex', () => {
    test('watch-state', () => {
      expect(perf(() => {
        const state = new State(1000)
        const watcher = watch(() => state.value)
        while (state.value--) {}
        watcher.destructor()
      })).toBeLessThan(4.48)
      expect(perf(() => {
        const state = new State(1000)
        const watcher = watch(() => state.value)
        while (state.value--) {}
        watcher.destructor()
      })).toBeGreaterThan(3.807)
    })
    test('mobx:autorun', () => {
      expect(perf(() => {
        const state = observable.box(1000)
        const disposer = autorun(() => state.get())
        while (state.get()) {
          state.set(state.get() - 1)
        }
        disposer()
      })).toBeLessThan(1.148)
      expect(perf(() => {
        const state = observable.box(1000)
        const disposer = autorun(() => state.get())
        while (state.get()) {
          state.set(state.get() - 1)
        }
        disposer()
      })).toBeGreaterThan(1.056)
    })
  })
})
