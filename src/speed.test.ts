import watch, {State, Watch, state} from '.'
import Computed, {computed as c} from './Computed'
import {autorun, observable, computed} from 'mobx'

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
      expect(perf(() => new State())).toBeLessThan(2302)
      expect(perf(() => new State())).toBeGreaterThan(1865)
    })
    test('mobx: observable.box', () => {
      expect(perf(() => observable.box())).toBeLessThan(1294)
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
      expect(perf(() => watch(() => color.value))).toBeLessThan(890)
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
        expect(perf(() => new Color())).toBeLessThan(1993)
        expect(perf(() => new Color())).toBeGreaterThan(1784)
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
        expect(perf(() => new Color())).toBeLessThan(1893)
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
        expect(perf(() => new Color())).toBeGreaterThan(211)
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
        expect(perf(() => new Color())).toBeLessThan(1515)
        expect(perf(() => new Color())).toBeGreaterThan(1309)
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
        expect(perf(() => new Color())).toBeGreaterThan(144)
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
        expect(perf(() => new Color())).toBeLessThan(185)
        expect(perf(() => new Color())).toBeGreaterThan(163)
      })
    })
  })
  describe('create computed', () => {
    test('watch-state: Computed', () => {
      expect(perf(() => new Computed(() => {}))).toBeLessThan(2186)
      expect(perf(() => new Computed(() => {}))).toBeGreaterThan(1993)
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
        expect(perf(() => new User())).toBeLessThan(1550)
        expect(perf(() => new User())).toBeGreaterThan(1196)
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
})
