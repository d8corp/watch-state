import perfocode, {describe, test} from 'perfocode'
import watch, {State, Watch, state} from './src'
import Computed, {computed as c} from './src/Computed'
import {autorun, observable, computed, reaction} from 'mobx'

perfocode('speed.test', () => {
  test('empty test', () => {})
  describe('create', () => {
    describe('state', () => {
      test('watch-state', () => new State())
      test('mobx: observable.box', () => observable.box())
    })
    describe('watch', () => {
      test('watch-state: Watch', () => new Watch(() => {}))
      test('watch-state: watch', () => watch(() => {}))
      test('mobx: autorun', () => autorun(() => {}))
    })
    describe('computed', () => {
      test('watch-state', () => new Computed(() => {}))
      test('mobx', () => computed(() => {}))
    })
    describe('computed decorator', () => {
      class User {
        @c get fullName () {
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
    describe('computed and state decorators', () => {
      class User {
        @state name = 'Mike'
        @state surname = 'Mighty'
        @c get fullName () {
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
  describe('update', () => {
    const state = new State(0)
    const stateMobx1 = observable.box(0)
    const stateMobx2 = observable.box(0)

    watch(() => state.value)
    autorun(() => stateMobx1.get())
    reaction(() => stateMobx2.get(), () => {})

    test('watch-state', () => state.value++)
    test('mobx: autorun', () => stateMobx1.set(stateMobx1.get() + 1))
    test('mobx: reaction', () => stateMobx2.set(stateMobx2.get() + 1))
  })
  describe('watch state', () => {
    const wsColor = new State('red')
    const mobxColor = observable.box('red')

    test('watch-state', () => watch(() => wsColor.value))
    test('mobx', () => autorun(() => mobxColor.get()))
  })
  describe('state decorator', () => {
    describe('one', () => {
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
  describe('complex', () => {
    test('watch-state', () => {
      const state = new State(1000)
      const watcher = watch(() => state.value)
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
  })
})
