<br>
<p align="center">
  <a href="https://github.com/d8corp/watch-state">
    <img width="200" height="200" src="https://raw.githubusercontent.com/d8corp/watch-state/v3/img/logo.svg" alt="watch-state logo by Mikhail Lysikov">
  </a>
</p>

<h1 align="center">watch-state</h1>

<p align="center">CANT inc. state management system.</p>

<br>

<div align="center">
  <table>
    <col width="140" align="center">
    <tr><td align="center">
      <a href="https://raw.githubusercontent.com/d8corp/watch-state/v3/img/speed.test.png" target="_blank">
        <img width="64" height="64" src="https://raw.githubusercontent.com/d8corp/watch-state/v3/img/fast.svg" alt="watch-state fast">
      </a>
      <br>
      <b>Fast</b>
      <br>
      One of the fastest
    </td>
    <td align="center"><span>
      <a href="https://bundlephobia.com/result?p=watch-state" target="_blank">
        <img width="64" height="64" src="https://raw.githubusercontent.com/d8corp/watch-state/v3/img/light.svg" alt="watch-state Light">
      </a>
      <br>
      <b>Light</b>
      <br>
      Less than 1kb minzip
    </span></td>
    <td align="center"><span>
      <a href="https://d8corp.github.io/watch-state/coverage/lcov-report/" target="_blank">
        <img width="64" height="64" src="https://raw.githubusercontent.com/d8corp/watch-state/v3/img/smart.svg" alt="watch-state fast">
      </a>
      <br>
      <b>Smart</b>
      <br>
      Steady architecture
    </span></td></tr>
  </table>
</div>

<br>

<div align="center">
  <a href="https://www.npmjs.com/package/watch-state" target="_blank">
    <img src="https://img.shields.io/npm/v/watch-state.svg" alt="watch-state npm">
  </a>
  <a href="https://bundlephobia.com/result?p=watch-state" target="_blank">
    <img src="https://img.shields.io/bundlephobia/minzip/watch-state" alt="watch-state minzipped size">
  </a>
  <a href="https://www.npmtrends.com/watch-state" target="_blank">
    <img src="https://img.shields.io/npm/dm/watch-state.svg" alt="watch-state minzipped size">
  </a>
  <a href="https://github.com/d8corp/watch-state/blob/master/LICENSE" target="_blank">
    <img src="https://img.shields.io/npm/l/watch-state" alt="watch-state license">
  </a>
  <a href="https://changelogs.xyz/watch-state" target="_blank">
    <img src="https://img.shields.io/badge/Changelog-⋮-brightgreen" alt="watch-state minzipped size">
  </a>
  <a href="https://d8corp.github.io/watch-state/coverage/lcov-report" target="_blank">
    <img src="https://github.com/d8corp/watch-state/workflows/tests/badge.svg" alt="watch-state minzipped size">
  </a>
</div>
<br>

`watch-state` is a fast, tiny and smart state management system.
Based on simplest principles: you have a **state**, the state can be **changed**, and you can **have** a **reaction** on it.

**watch-state** inspired by **async-await** pattern, you can image it like this:
```typescript jsx
state count = 0

watch {
  console.log(count)
}
```

You can create a **tree of watchers** and then remove all of them by one method run.

**No limits**, you can do every you want with it.
You can get a loop or an exception, but it's only up to you (*maybe you want to get a loop*).

[![stars](https://img.shields.io/github/stars/d8corp/watch-state?style=social)](https://github.com/d8corp/watch-state/stargazers)
[![watchers](https://img.shields.io/github/watchers/d8corp/watch-state?style=social)](https://github.com/d8corp/watch-state/watchers)

## Browser supports

### Desktop

| <img src="https://cdn.worldvectorlogo.com/logos/firefox.svg" width="18" valign="middle"> Firefox | <img src="https://cdn.worldvectorlogo.com/logos/chrome.svg" width="18" valign="middle"> Chrome | <img src="https://cdn.worldvectorlogo.com/logos/safari-3.svg" width="18" valign="middle"> Safari | <img src="https://cdn.worldvectorlogo.com/logos/opera-2.svg" width="18" valign="middle"> Opera | <img src="https://cdn.worldvectorlogo.com/logos/microsoft-edge-1.svg" width="18" valign="middle"> Edge |
|:-------:|:------:|:------:|:-----:|:----:|
| 45+     | 49+    | 9+     | 36+   | 13+  |

### Mobile

| <img src="https://cdn.worldvectorlogo.com/logos/firefox.svg" width="18" valign="middle"> Firefox | <img src="https://cdn.worldvectorlogo.com/logos/chrome.svg" width="18" valign="middle"> Chrome | <img src="https://cdn.worldvectorlogo.com/logos/safari-3.svg" width="18" valign="middle"> Safari | <img src="https://cdn.worldvectorlogo.com/logos/opera-2.svg" width="18" valign="middle"> Opera |
|:-------:|:------:|:------:|:-----:|
| 87+     | 90+    | 9+     | 62+   |

*You can transpile it supporting old browsers, but the performance decreases.*

## Install
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
## Usage
### Simple example:
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
### Update argument:
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
You can watch a state once with `update`
```typescript jsx
const count = new State(0)

new Watch(update => {
  
  if (!update) {

    // Watch this value
    count.value

  } else {

    // React on changes
    console.log('The value was changed')

  }

})

count.value++
// console.log('The value was changed')

count.value++
// nothing happenes
```
*That's not all you can do with it, more examples come soon*
### Force update of State
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
### Force update of Watch
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
### Destroy
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
### Watch.onDestroy()
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
### Deep watch:
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
### Cache:
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
### Event:
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
You can use an event inside a watcher when you do not want to react on states
```typescript jsx
const count = new State(0)
const event = new Event()

new Watch(() => {
  event.start()
  console.log(count.value++)
  event.end()
})
```
*You will get loop without event*
### Typescript:
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

