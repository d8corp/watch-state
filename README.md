# watch-state
[![NPM](https://img.shields.io/npm/v/watch-state.svg)](https://github.com/d8corp/watch-state/blob/master/CHANGELOG.md)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/watch-state)](https://github.com/d8corp/watch-state/blob/master/watchState.min.js)
[![downloads](https://img.shields.io/npm/dm/watch-state.svg)](https://www.npmjs.com/package/watch-state)
[![license](https://img.shields.io/npm/l/watch-state)](https://github.com/d8corp/watch-state/blob/master/LICENSE)  
The simplest watcher of your state.
### Installation
npm
```bash
npm i watch-state
```
yarn
```bash
yarn add watch-state
```
### Using
##### Simple example:
You can create an instance of `State` and **watch** its **value**.
```javascript
import {watch, State} from 'watch-state'

const count = new State(0)

watch(() => console.log(count.value))
// console.log(0)

count.value++
// console.log(1)
```
`watch` is a function which returns instance of `Watch`, the next example equals the previous.
```javascript
import {Watch, State} from 'watch-state'

const count = new State(0)

new Watch(() => console.log(count.value))
// console.log(0)

count.value++
// console.log(1)
```
##### Update argument:
You can check if watch target is running first by `update` argument.
```javascript
const count = new State(0)

watch(update => console.log(update, count.value))
// console.log(false, 0)

count.value++
// console.log(true, 1)

count.value++
// console.log(true, 2)
```
##### Deep watch:
You can use `watch` inside watcher. Each watcher reacts on that states which used only inside it.
```javascript
const watchState = new State(true)
const state = new State(0)
let test = 0

watch(() => {
  test++
  if (watchState.value) {
    watch(() => console.log(state.value))
  }
})
// console.log(0), test = 1

state.value++
// console.log(1), test = 1

watchState.value = false
// test = 2

state.value++
// nothing happens
```
### Interface
##### Watch.destructor()
You can stop watching by `destructor` method of `Watch`
```javascript
const count = new State(0)

const watcher = watch(() => console.log(count.value))
// console.log(0)

count.value++
// console.log(1)

watcher.destructor()

count.value++
// nothing happens
```
##### Watch.onDestructor()
You can react on destruction of `Watch` by `onDestructor` method
```javascript
const watcher = watch(() => {})

watcher.onDestructor(() => console.log('destructor'))

watcher.destructor()
// console.log('destructor')
```
`onDestructor` returns `this` so you can use **fluent interface**
```javascript
const watcher = watch(() => {})
  .onDestructor(() => console.log('destructor'))

watcher.destructor()
// console.log('destructor')
```
Or you can use `onDestructor` function inside a watcher
```javascript
import {watch, onDestructor} from 'watch-state'

const watcher = watch(() => {
  // do something
  onDestructor(() => console.log('destructor'))
})

watcher.destructor()
// console.log('destructor')
```
##### onUpdate:
## Issues
If you find a bug or have a suggestion, please file an issue on [GitHub](https://github.com/d8corp/watch-state/issues)  
[![issues](https://img.shields.io/github/issues-raw/d8corp/watch-state)](https://github.com/d8corp/watch-state/issues)  
> ---
[![stars](https://img.shields.io/github/stars/d8corp/watch-state?style=social)](https://github.com/d8corp/watch-state/stargazers)
[![watchers](https://img.shields.io/github/watchers/d8corp/watch-state?style=social)](https://github.com/d8corp/watch-state/watchers)

