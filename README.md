&nbsp; &nbsp; &nbsp; [![watch-state](https://raw.githubusercontent.com/d8corp/watch-state/v3/img/logo.svg)](https://github.com/d8corp/watch-state)

# watch-state
[![NPM](https://img.shields.io/npm/v/watch-state.svg)](https://github.com/d8corp/watch-state/blob/master/CHANGELOG.md)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/watch-state)](https://bundlephobia.com/result?p=watch-state)
[![downloads](https://img.shields.io/npm/dm/watch-state.svg)](https://www.npmjs.com/package/watch-state)
[![license](https://img.shields.io/npm/l/watch-state)](https://github.com/d8corp/watch-state/blob/master/LICENSE)
[![tests](https://github.com/d8corp/watch-state/workflows/tests/badge.svg)](https://d8corp.github.io/watch-state/coverage/lcov-report/)  
CANT inc. state management system.

&nbsp;  

| ![Fast](https://raw.githubusercontent.com/d8corp/watch-state/v3/img/fast.svg) <br> Fast | ![Light](https://raw.githubusercontent.com/d8corp/watch-state/v3/img/light.svg) <br> Light | ![Smart](https://raw.githubusercontent.com/d8corp/watch-state/v3/img/smart.svg) <br> Smart |
|:----:|:-----:|:-----:|
| &nbsp; One of the fastest &nbsp; | Less than 1kb minzip | Steady architecture |

&nbsp;  

[![stars](https://img.shields.io/github/stars/d8corp/watch-state?style=social)](https://github.com/d8corp/watch-state/stargazers)
[![watchers](https://img.shields.io/github/watchers/d8corp/watch-state?style=social)](https://github.com/d8corp/watch-state/watchers)

### Browser supports

`Desktop`

| <img src="https://cdn.worldvectorlogo.com/logos/firefox-3.svg" width="18" valign="middle"> Firefox | <img src="https://cdn.worldvectorlogo.com/logos/chrome-7.svg" width="18" valign="middle"> Chrome | <img src="https://cdn.worldvectorlogo.com/logos/safari-3.svg" width="18" valign="middle"> Safari | <img src="https://cdn.worldvectorlogo.com/logos/opera-2.svg" width="18" valign="middle"> Opera | <img src="https://cdn.worldvectorlogo.com/logos/microsoft-edge-1.svg" width="18" valign="middle"> Edge |
|:-------:|:------:|:------:|:-----:|:----:|
| 45+     | 49+    | 9+     | 36+   | 13+  |

`Mobile`

| <img src="https://cdn.worldvectorlogo.com/logos/firefox-3.svg" width="18" valign="middle"> Firefox | <img src="https://cdn.worldvectorlogo.com/logos/chrome-7.svg" width="18" valign="middle"> Chrome | <img src="https://cdn.worldvectorlogo.com/logos/safari-3.svg" width="18" valign="middle"> Safari | <img src="https://cdn.worldvectorlogo.com/logos/opera-2.svg" width="18" valign="middle"> Opera |
|:-------:|:------:|:------:|:-----:|
| 87+     | 90+    | 9+     | 62+   |

*You can transpile it supporting old browsers, but the performance decreases.*

### Installation
npm
```shell
npm i watch-state
```
yarn
```shell
yarn add watch-state
```
Or you can include this script to the head. 
```html
<script defer src="https://unpkg.com/watch-state/watch-state.min.js"></script>
```
Use `watchState` to get any class from the library.
```js
const {
  Watch,
  State,
  Cache,
  Event
} = watchState
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
##### Destroy
You can stop watching by `destroy` method of `Watch`.
```javascript
const count = new State(0)

const watcher = new Watch(() => {
  console.log(count.value)
})
// console.log(0)

count.value++
// console.log(1)

watcher.destroy()

count.value++
// nothing happens
```
##### Watch.onDestroy()
You can react on destruction of `Watch` by `onDestroy` method.
```javascript
const watcher = new Watch(() => {})

watcher.onDestroy(() => {
  console.log('destructor')
})

watcher.destroy()
// console.log('destructor')
```
`onDestructor` returns `this` so you can use **fluent interface**.
```javascript
const watcher = new Watch(() => {})
  .onDestroy(() => console.log('destructor'))

watcher.destroy()
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
    new Watch(() => {
      console.log(state.value)
    })
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
You can cache computed values.  
The watcher will not be triggered while new result is the same.
```javascript
const name = new State('Foo')
const surname = new State('Bar')

const fullName = new Cache(() => (
  `${name.value} ${surname.value[0]}`
))

new Watch(() => {
  console.log(fullName.value)
})
// console.log('Foo B')

surname.value = 'Baz'
// nothing happens

surname.value = 'Quux'
// console.log('Foo Q')
```
You can force update the cache by `update` method.
```typescript
surname.update()
// console.log('Mike M')
```
You can use `destroy` and `onDestroy` like you do it on a watcher.
```typescript
surname.destroy()
```
The computing will be triggered only when a state inside the cache will be changed. So you can modify data only when it's needed.
```typescript
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
Use `Event` when you change several states to run their watchers after the event finished.
```javascript
const name = new State('Foo')
const surname = new State('Bar')
const event = new Event()

new Watch(() => {
  console.log(name.value, surname.value)
})
// console.log('Foo', 'Bar')

event.start()
name.value = 'Baz'
surname.value = 'Boo'
event.end()
// console.log('Baz', 'Boo')
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
You can check the performance test with **[MobX](https://www.npmjs.com/package/mobx)**, **[Effector](https://www.npmjs.com/package/effector)**, **[Storeon](https://www.npmjs.com/package/storeon)**, **[Mazzard](https://www.npmjs.com/package/mazzard)** and **[Redux](https://www.npmjs.com/package/redux)**.
Clone the repo, install packages and run this command
```shell
npm run speed
```
I got this results:  
![test](https://raw.githubusercontent.com/d8corp/watch-state/v3/img/speed.test.png)
## Links
You can find more tools [here](https://www.npmjs.com/search?q=%40watch-state)
## Issues
If you find a bug or have a suggestion, please file an issue on [GitHub](https://github.com/d8corp/watch-state/issues)  
[![issues](https://img.shields.io/github/issues-raw/d8corp/watch-state)](https://github.com/d8corp/watch-state/issues)

