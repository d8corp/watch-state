<br>
<p align="center">
  <a href="https://github.com/d8corp/watch-state">
    <img width="200" height="200" src="https://raw.githubusercontent.com/d8corp/watch-state/v3.3.1/img/logo.svg" alt="watch-state logo by Mikhail Lysikov">
  </a>
</p>

<h1 align="center">watch-state</h1>

<p align="center">CANT inc. Reactive State Engine</p>

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
      Less than 1 KB minzip
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
    <img src="https://github.com/d8corp/watch-state/actions/workflows/tests.yml/badge.svg" alt="watch-state tests">
  </a>
</div>
<br>

`watch-state` is a **lightweight, high-performance reactive state engine** designed to power UI frameworks — **or replace them.**

It provides **memory-safe reactivity** without Proxy, without magic, and without framework lock-in.

Use it as the core state layer in your own framework, embed it in React components, or build a full UI — **no JSX, no virtual DOM, no framework required**.

Was born during working on [@innet/dom](https://www.npmjs.com/package/@innet/dom).

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

## Index

- [Install](#install)
- [Usage](#usage)
  - [Simple example](#simple-example)
  - [Example Vanilla JS](#example-vanilla-js)
  - [Example @innet/dom](#example-innetdom)
- [Watch](#watch)
  - [Update argument](#update-argument)
  - [Force update of Watch](#force-update-of-watch)
  - [Destroy Watch](#destroy-watch)
  - [Deep/Nested watchers](#deepnested-watchers)
- [State](#state)

## Install
###### [🏠︎](#index) / Install [↓](#usage)

npm
```shell
npm i watch-state
```

yarn
```shell
yarn add watch-state
```

html
```html
<script src="https://cdn.jsdelivr.net/npm/watch-state"></script>
```

[minified on GitHub](https://github.com/d8corp/watch-state/blob/master/release/index.min.js)

## Usage
###### [🏠︎](#index) / Usage [↑](#install) [↓](#watch)

<sup>[Simple example](#simple-example) • [Example Vanilla JS](#example-vanilla-js) • [Example React](#example-react) • [Example @innet/dom](#example-innetdom)</sup>

### Simple example
###### [🏠︎](#index) / [Usage](#usage) / Simple example [↓](#example-vanilla-js)

You can create an instance of `State` and **watch** its **value**.

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

### Example Vanilla JS
###### [🏠︎](#index) / [Usage](#usage) / Example Vanilla JS [↑](#simple-example) [↓](#example-react)

Simple reactive state without build tools or framework dependencies.

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Counter</title>
    <script src="https://cdn.jsdelivr.net/npm/watch-state"></script>
    <script type="module">
      const { State, Watch } = WatchState

      const count = new State(0)
      const button = document.createElement('button');

      document.body.appendChild(button);

      new Watch(() => {
        button.innerText = count.value
      })

      button.addEventListener('click', () => {
        count.value++
      })
    </script>
</head>
<body>
</body>
</html>
```

### Example React
###### [🏠︎](#index) / [Usage](#usage) / Example React [↑](#example-vanilla-js) [↓](#example-innetdom)

`@watch-state/react` provides `useWatch()` hook that automatically subscribes React components to state changes and re-renders only when needed.

```tsx
import { State } from 'watch-state'
import { useWatch } from '@watch-state/react'

const $count = new State(0)

const increase = () => {
  $count.value++
}

export function CountButton () {
  const count = useWatch($count)

  return <button onClick={increase}>{count}</button>
}
```

### Example @innet/dom
###### [🏠︎](#index) / [Usage](#usage) / Example @innet/dom [↑](#example-react)

**Zero-runtime reactivity with @innet/dom:**

`@innet/dom` automatically watches accessed states and **updates only changed DOM content** — **no full re-renders**.

```tsx
import { State } from 'watch-state'

const count = new State(0)

const increase = () => {
  count.value++
}

export function CountButton () {
  return <button onClick={increase}>{count}</button>
}
```

Key benefits:

- No Watch or useWatch needed — framework handles reactivity
- Only button content updates, no re-renders of component/DOM tree
- Direct state access {count} auto-triggers minimal updates
- Works with any JSX/TSX without extra setup

## Watch
###### [🏠︎](#index) / Watch [↑](#usage) [↓](#state)

**Reactive effect that automatically tracks and reacts to state changes.**

`Watch` executes a callback when any accessed `State.value` changes.
Accessing `.value` **inside the callback auto-subscribes** to that state — no manual registration needed.

```ts
// Create state
const count = new State(0)

// Create watcher that logs the state changes
new Watch(() => console.log(count.value)) // auto-subscribes to count

count.value = 1 // triggers watcher callback
```

### Update argument
###### [🏠︎](#index) / [Watch](#watch) / Update argument

**Distinguish initial run from updates using `update` parameter.**

`update` is `false` on **first execution** (initial subscription), `true` on **subsequent re-runs** when states change.

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

**Watch state once using `update` flag and auto-destroy:**

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
// nothing happens
```

### Force update of Watch
###### [🏠︎](#index) / [Watch](#watch) / Force update of Watch

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

### Destroy Watch
###### [🏠︎](#index) / [Watch](#watch) / Destroy Watch

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

### Deep/Nested watchers
###### [🏠︎](#index) / [Watch](#watch) / Deep/Nested watchers

**Create conditional and nested reactive effects.**

Each `Watch` **independently tracks only states accessed within its callback**.
Nested watchers created inside parent watchers form a **dependency tree** with separate reactivity.

```javascript
const watching = new State(true)
const state = new State(0)

new Watch(() => {
  console.log('Root Render')

  if (watching.value) {
    new Watch(() => {
      console.log(`Deep Render: ${state.value}`)
    })
  }
})
// logs: Root Render, Deep Render: 0

state.value++
// logs: Deep Render: 1  (only deep watcher reacts)

watching.value = false
// logs: Root Render     (deep watcher destroyed)

state.value++
// nothing happens       (no active deep watcher)
```

## State
###### [🏠︎](#index) / State

### Force update of State
###### [🏠︎](#index) / [State](#state) / Force update of State

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

### Compute:
###### [🏠︎](#index) / Compute

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

### onDestroy()
###### [🏠︎](#index) / [State](#state) / onDestroy()

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

### createEvent
You can create event function with `createEvent`
```typescript
import { State, createEvent } from 'watch-state'

const count = new State(0)
const increase = createEvent(() => {
  console.log(count.value++)
})

new Watch(() => console.log(count.value))
// console.log(0)

increase()
// console.log(1)

increase()
// console.log(2)
```

### Typescript:
Generic of `State`
```typescript
const key = new State<string | number>()

key.value = false
// error, you can use only string or number
```
Generic of `Cache`
```typescript
new Cache<string>(() => false)
// error, target of cache should return string
```

## Performance
You can check a performance test with **[MobX](https://www.npmjs.com/package/mobx)**, **[Effector](https://www.npmjs.com/package/effector)**, **[Storeon](https://www.npmjs.com/package/storeon)**, **[Mazzard](https://www.npmjs.com/package/mazzard)** and **[Redux](https://www.npmjs.com/package/redux)**.
Clone the repo, install packages and run this command
```shell
npm run speed
```

## Links
You can find more tools [here](https://www.npmjs.com/search?q=%40watch-state)

## Issues
If you find a bug or have a suggestion, please file an issue on [GitHub](https://github.com/d8corp/watch-state/issues)

[![issues](https://img.shields.io/github/issues-raw/d8corp/watch-state)](https://github.com/d8corp/watch-state/issues)

