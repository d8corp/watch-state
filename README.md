[![watch-state](https://raw.githubusercontent.com/d8corp/watch-state/master/logo.png)](https://github.com/d8corp/watch-state)

# watch-state
[![NPM](https://img.shields.io/npm/v/watch-state.svg)](https://github.com/d8corp/watch-state/blob/master/CHANGELOG.md)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/watch-state)](https://bundlephobia.com/result?p=watch-state)
[![downloads](https://img.shields.io/npm/dm/watch-state.svg)](https://www.npmjs.com/package/watch-state)
[![license](https://img.shields.io/npm/l/watch-state)](https://github.com/d8corp/watch-state/blob/master/LICENSE)
[![tests](https://github.com/d8corp/watch-state/workflows/tests/badge.svg)](https://d8corp.github.io/watch-state/coverage/lcov-report/)  
The simplest watcher of your state.
### Installation
npm
```shell
npm i watch-state
```
yarn
```shell
yarn add watch-state
```
### Using
##### Simple example:
You can create an instance of `State` and **watch** it's **value**.
```javascript
import {Watch, State} from 'watch-state'

const count = new State(0)

new Watch(() => console.log(count.value))
// console.log(0)

count.value++
// console.log(1)

count.value++
// console.log(2)
```
##### Update argument:
You can check if the watching ran first by `update` argument.
```javascript
const count = new State(0)

new Watch(update => {
  console.log(update, count.value)
})
// console.log(false, 0)

count.value++
// console.log(true, 1)

count.value++
// console.log(true, 2)
```
##### Force update of State
You can run watchers of a state with `update` method.
```typescript
const count = new State(0)

new Watch(() => {
  console.log(count.value)
})
// console.log(0)

count.update()
// console.log(0)
```
##### Force update of Watch
You can run a watcher even when it's states are not updated.
```typescript
const count = new State(0)

const watcher = new Watch(() => {
  console.log(count.value)
})
// console.log(0)

watcher.update()
// console.log(0)
```
##### Destructor
You can stop watching by `destructor` method of `Watch`.
```javascript
const count = new State(0)

const watcher = new Watch(() => console.log(count.value))
// console.log(0)

count.value++
// console.log(1)

watcher.destructor()

count.value++
// nothing happens
```
##### Watch.onDestructor()
You can react on destruction of `Watch` by `onDestructor` method.
```javascript
const watcher = new Watch(() => {})

watcher.onDestructor(() => console.log('destructor'))

watcher.destructor()
// console.log('destructor')
```
`onDestructor` returns `this` so you can use **fluent interface**.
```javascript
const watcher = new Watch(() => {})
  .onDestructor(() => console.log('destructor'))

watcher.destructor()
// console.log('destructor')
```
Or you can use `onDestructor` function inside a watcher.
```javascript
import {Watch, onDestructor} from 'watch-state'

const watcher = new Watch(update => {
  // do something
  if (!update) {
    onDestructor(() => console.log('destructor'))
  }
})

watcher.destructor()
// console.log('destructor')
```
##### Deep watch:
You can use `Watch` inside a watcher.
Each watcher reacts on that states which used only inside it.
```javascript
const watching = new State(true)
const state = new State(0)
let test = 0

new Watch(() => {
  test++
  if (watching.value) {
    new Watch(() => console.log(state.value))
  }
})
// console.log(0), test = 1

state.value++
// console.log(1), test = 1

watching.value = false
// test = 2

state.value++
// nothing happens
```
##### Cache:
You may cache computed values.
The watcher will not be triggered while new result is the same.
```javascript
const name = new State('Mike')
const surname = new State('Deight')

const fullName = new Cache(() => (
  `${name.value} ${surname.value[0]}`
))

new Watch(() => console.log(fullName.value))
// console.log('Mike D')

surname.value = 'D8'
// nothing happens

surname.value = 'Mighty'
// console.log('Mike M')
```
The computing will be triggered only when a state inside the cache will be changed.
So you can modify data only when it's needed.
```javascript
const list = new State(['foo', 'bar', 'baz'])

const sortedList = new Cache(() => {
  console.log('computing')
  return [...list.value].sort()
})
// nothing happens

const value = sortedList.value
// console.log('computing')

console.log(sortedList.value)
// console.log(['bar', 'baz', 'foo'])

console.log(value === sortedList.value)
// console.log(true)

list.value = ['b', 'c', 'a']
// nothing happens

console.log(sortedList.value)
// console.log('computing')
// console.log(['a', 'b', 'c'])
```
##### Event:
Use `createEvent` when you change several states to run their watchers after the event finished.
```javascript
const name = new State('Mike')
const surname = new State('Deight')

const setFullName = createEvent(fullName => {

  const [newName, newSurname] = fullName.split(' ')

  name.value = newName
  surname.value = newSurname

})

new Watch(() => {
  console.log(name.value, surname.value)
})
// console.log('Mike', 'Deight')

setFullName('Michael Mighty')
// console.log('Michael', 'Mighty')
```
##### Decorators:
You can use decorators with `watch-sate`.  
*Available:* `watch` `state` `cache` `event`
```javascript
import {watch, state, cache, event} from 'watch-state'

class Counter {
  // fields
  @state value = 1

  // accessors
  @cache get square () {
    return this.value ** 2
  }

  // methods
  @event tick () {
    this.value++
  }
  @watch run () {
    console.log(this.value, this.square)
  }
}


const counter = new Counter()

counter.run()
// console.log(1, 1)

counter.tick()
// console.log(2, 4)
```
##### getState and getCache
You can get `State` or `Cache` of a decorated field with `getState` and `getCache`.
```typescript
import {state, getState, Watch} from 'watch-state'

class TodoList {
  @state todos = []
}

const todoList = new TodoList()

new Watch(() => console.log(todoList.todos))
// console.log([])

todoList.todos.push('Do something')
// nothing happens

getState(todoList, 'todos').update()
// console.log(['Do something'])
```
##### Typescript:
Generic of `State`
```typescript
const key = new State<string | number>()

key.value = false
// error, you can use only streng or number
```
Generic of `Cache`
```typescript
new Cache<string>(() => false)
// error, target of cache should return string
```
## Performance
You can check the performance test with **MobX**, **effector** and **Redux**.
Clone the repo, install packages and run this command
```shell
npm run speed
```
This is a case from the tests:  
![test](https://raw.githubusercontent.com/d8corp/watch-state/master/test.png)
## Issues
If you find a bug or have a suggestion, please file an issue on [GitHub](https://github.com/d8corp/watch-state/issues)  
[![issues](https://img.shields.io/github/issues-raw/d8corp/watch-state)](https://github.com/d8corp/watch-state/issues)  
> ---
[![stars](https://img.shields.io/github/stars/d8corp/watch-state?style=social)](https://github.com/d8corp/watch-state/stargazers)
[![watchers](https://img.shields.io/github/watchers/d8corp/watch-state?style=social)](https://github.com/d8corp/watch-state/watchers)

