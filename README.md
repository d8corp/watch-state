<br>
<p align="center">
  <a href="https://github.com/d8corp/watch-state">
    <img width="200" height="200" src="https://raw.githubusercontent.com/d8corp/watch-state/v3.3.1/img/logo.svg" alt="watch-state logo by Mikhail Lysikov">
  </a>
</p>

<h1 align="center">watch-state</h1>

<p align="center">CANT inc. state management system.</p>

<br>

<div align="center">
  <table>
    <col width="140" align="center">
    <tr><td align="center">
      <a href="https://raw.githubusercontent.com/d8corp/watch-state/v3.3.1/img/speed.test.png" target="_blank">
        <img width="64" height="64" src="https://raw.githubusercontent.com/d8corp/watch-state/v3.3.1/img/fast.svg" alt="watch-state fast">
      </a>
      <br>
      <b>Fast</b>
      <br>
      One of the fastest
    </td>
    <td align="center"><span>
      <a href="https://bundlephobia.com/result?p=watch-state" target="_blank">
        <img width="64" height="64" src="https://raw.githubusercontent.com/d8corp/watch-state/v3.3.1/img/light.svg" alt="watch-state Light">
      </a>
      <br>
      <b>Light</b>
      <br>
      Less than 1kb minzip
    </span></td>
    <td align="center"><span>
      <a href="https://d8corp.github.io/watch-state/coverage/lcov-report/" target="_blank">
        <img width="64" height="64" src="https://raw.githubusercontent.com/d8corp/watch-state/v3.3.1/img/smart.svg" alt="watch-state fast">
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
    <img src="https://img.shields.io/npm/dm/watch-state.svg" alt="watch-state downloads">
  </a>
  <a href="https://packagequality.com/#?package=watch-state" target="_blank">
    <img src="https://packagequality.com/shield/watch-state.svg" alt="watch-state quality">
  </a>
  <a href="https://github.com/d8corp/watch-state/blob/master/LICENSE" target="_blank">
    <img src="https://img.shields.io/npm/l/watch-state" alt="watch-state license">
  </a>
  <a href="https://changelogs.xyz/watch-state" target="_blank">
    <img src="https://img.shields.io/badge/Changelog-⋮-brightgreen" alt="watch-state changelog">
  </a>
  <a href="https://d8corp.github.io/watch-state/coverage/lcov-report" target="_blank">
    <img src="https://github.com/d8corp/watch-state/workflows/tests/badge.svg" alt="watch-state tests">
  </a>
</div>
<br>

This is a fast, tiny and smart state management system.
Based on simplest principles: you have a **state** and you can **watch** for the state changes.
Was born during working on [innet](https://www.npmjs.com/package/innet).


**watch-state** inspired by **async-await** pattern, you can image it like this:
```typescript jsx
state count = 0

watch {
  console.log(count)
}
```

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
import { Watch, State } from 'watch-state'

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
As example, you can watch a state once
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

### destroy
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

### onDestroy()
You can subscribe on destroy or update of watcher
```javascript
const count = new State(0)
const watcher = new Watch(() => {
  console.log('count', count.value)
  // the order does not matter
  onDestroy(() => console.log('destructor'))
})
// console.log('count', 0)

count.value++
// console.log('destructor')
// console.log('count', 1)

watcher.destroy()
// console.log('destructor')

watcher.destroy()
count.value++
// nothing happens
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
You can cache computed state.  
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
fullName.update()
// console.log('Foo Q')
```
> Cache will be immediately updated only if a watcher looks after the cache.

You can use `destroy` and `onDestroy` like you do it on a watcher.
```typescript
fullName.destroy()
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

You can use `globalEvent` every time if you do not want to extend the Event functionality.
```typescript
import { State, globalEvent } from 'watch-state'
const count = new State(0)

new Watch(() => {
  globalEvent.start()
  console.log(count.value++)
  globalEvent.end()
})
```

### createEvent
You can create event function with createEvent
```typescript
import { State, createEvent } from 'watch-state'

const count = new State(0)
const increase = createEvent(() => {
  console.log(count.value++)
})

new Watch(increase)
```

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

## Links
You can find more tools [here](https://www.npmjs.com/search?q=%40watch-state)

## Issues
If you find a bug or have a suggestion, please file an issue on [GitHub](https://github.com/d8corp/watch-state/issues)

[![issues](https://img.shields.io/github/issues-raw/d8corp/watch-state)](https://github.com/d8corp/watch-state/issues)

