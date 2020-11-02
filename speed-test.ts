import colors from 'colors'
import watch, {State, Watch, state} from './src'
import Computed, {computed as c} from './src/Computed'
import {autorun, observable, computed, reaction} from 'mobx'
import fs from 'fs'

let currentTimeout = 200
let file = {}
const deep = []

function perf (callback: () => void, ms = currentTimeout): number {
  let count = 0
  const endTime = Date.now() + ms
  do {
    callback()
    count++
  } while (Date.now() < endTime)
  return count / ms
}

function getDeep (): string {
  let result = ''
  for (let i = 0; i < deep.length; i++) {
    result += '│'
  }
  return result
}

function describe (name: string, callback: () => any, timeout = currentTimeout) {
  const beforeTimeout = currentTimeout
  currentTimeout = timeout
  console.log(getDeep() + '╒ ' + name)
  deep.push(name)
  callback()
  deep.pop()
  console.log(getDeep() + '╘ ' + name)
  currentTimeout = beforeTimeout
}

function test (test: string, callback: () => any, timeout = currentTimeout) {
  const value = perf(callback, timeout)
  let minColor = colors.gray
  let maxColor = colors.gray
  let beforeMin = ''
  let beforeMax = ''
  let afterMin = ''
  let afterMax = ''
  let object = file
  for (const name of deep) {
    if (!(name in object)) {
      object[name] = {}
    }
    object = object[name]
  }
  if (test in object) {
    if (value < object[test].min) {
      minColor = colors.red
      beforeMin = colors.gray(object[test].min + ' < ')
      object[test].min = value
    } else if (value > object[test].max) {
      maxColor = colors.green
      beforeMax = colors.gray(' > ' + object[test].max)
      object[test].max = value
    }
  } else {
    minColor = colors.yellow
    maxColor = colors.yellow
    object[test] = {
      min: value,
      max: value,
    }
  }
  let deepPrefix = getDeep()
  if (deepPrefix) {
    deepPrefix = deepPrefix.slice(0, -1) + '╞'
  }
  console.log(`${deepPrefix} ${test}: ${minColor(`${object[test].min} < `)}${beforeMin}${value}${beforeMax}${maxColor(` > ${object[test].max}`)}`)
}

function performanceTest (output: string, callback: () => any, timeout = currentTimeout) {
  currentTimeout = timeout
  try {
    file = JSON.parse(fs.readFileSync(output + '.json') as unknown as string)
  } catch (e) {}
  callback()
  fs.writeFileSync(output + '.json', JSON.stringify(file, null, 2))
}

performanceTest('speed-test', () => {
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
