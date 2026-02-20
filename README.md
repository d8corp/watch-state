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
      <a href="https://d8corp.github.io/watch-state/coverage/lcov-report" target="_blank">
        <img width="64" height="64" src="https://raw.githubusercontent.com/d8corp/watch-state/v3.3.1/img/smart.svg" alt="watch-state smart">
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
  <a href="https://www.npmtrends.com/watch-state" target="_blank">
    <img src="https://img.shields.io/npm/dm/watch-state.svg" alt="watch-state downloads">
  </a>
  <a href="https://www.typescriptlang.org" target="_blank">
    <img src="https://img.shields.io/npm/types/watch-state" alt="TypeSctipt">
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

<sup>**[ [Install](#install) ]**</sup>  
<sup>**[ [Usage](#usage) ]** [Simple example](#simple-example) • [Example Vanilla JS](#example-vanilla-js) • [Example React](#example-react) • [Example @innet/dom](#example-innetdom)</sup>  
<sup>**[ [Watch](#watch) ]** [Update argument](#update-argument) • [Force update of Watch](#force-update-of-watch) • [Destroy Watch](#destroy-watch) • [Deep/Nested watchers](#deepnested-watchers)</sup>  
<sup>**[ [State](#state) ]** [Get or Set value](#get-or-set-value) • [Force update of State](#force-update-of-state) • [Raw value](#raw-value) • [State.set (experimental)](#stateset-experimental)</sup>  
<sup>**[ [Compute](#compute) ]** [Lazy computation](#lazy-computation) • [Force update of Compute](#force-update-of-compute) • [Destroy Compute](#destroy-compute)</sup>  
<sup>**[ [Utils](#utils) ]** [onDestroy](#ondestroy) • [callEvent](#callevent) • [createEvent](#createevent) • [unwatch](#unwatch)</sup>  
<sup>**[ [Typescript](#typescript) ]**</sup>  
<sup>**[ [Performance](#performance) ]**</sup>

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

The library is based on the core concepts of `Observable` (something that can be observed) and `Observer` (something that can observe). On top of these concepts, the core classes `State`, `Compute`, and `Watch` are built according to the following scheme:

```
   ┌────────────┐ ┌─────────────┐
   │ Observable │ │  Observer   │
   │ (abstract) │ │ (interface) │
   └──────┬─────┘ └──────┬──────┘  
     ┌────┴─────┐ ┌──────┴───┐
┌────┴────┐ ┌───┴─┴───┐ ┌────┴────┐
│  State  │ │ Compute │ │  Watch  │
└─────────┘ └─────────┘ └─────────┘
```

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

[@watch-state/react](https://www.npmjs.com/package/@watch-state/react) provides `useObservable()` hook that automatically subscribes React components to state changes and re-renders only when needed.

```tsx
import { State } from 'watch-state'
import { useObservable } from '@watch-state/react'

const $count = new State(0)

const increase = () => {
  $count.value++
}

export function CountButton () {
  const count = useObservable($count)

  return <button onClick={increase}>{count}</button>
}
```

### Example @innet/dom
###### [🏠︎](#index) / [Usage](#usage) / Example @innet/dom [↑](#example-react)

**Zero-runtime reactivity with [@innet/dom](https://www.npmjs.com/package/@innet/dom):**

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

<sup>[Update argument](#update-argument) • [Force update of Watch](#force-update-of-watch) • [Destroy Watch](#destroy-watch) • [Deep/Nested watchers](#deepnested-watchers)</sup>

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
###### [🏠︎](#index) / [Watch](#watch) / Update argument [↓](#force-update-of-watch)

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
###### [🏠︎](#index) / [Watch](#watch) / Force update of Watch [↑](#update-argument) [↓](#destroy-watch)

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
###### [🏠︎](#index) / [Watch](#watch) / Destroy Watch [↑](#force-update-of-watch) [↓](#deepnested-watchers)

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
###### [🏠︎](#index) / [Watch](#watch) / Deep/Nested watchers [↑](#destroy-watch)

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
###### [🏠︎](#index) / State [↑](#watch) [↓](#compute)

<sup>[Get or Set value](#get-or-set-value) • [Force update of State](#force-update-of-state) • [Raw value](#raw-value) • [State.set (experimental)](#stateset-experimental)</sup>

**Reactive primitive** that automatically notifies all subscribed watchers when `.value` changes.

### Get or Set value
###### [🏠︎](#index) / [State](#state) / Get or Set value [↓](#force-update-of-state)

**Access or mutate the state value.** Reading `.value` inside `Watch` **auto-subscribes** to changes. Writing `.value` **triggers all watchers**.

```ts
const count = new State(0)

new Watch(() => console.log(count.value))
// auto-subscribes and logs 0

count.value++ // triggers: logs 1
```

### Force update of State
###### [🏠︎](#index) / [State](#state) / Force update of State [↑](#get-or-set-value) [↓](#raw-value)

You can run watchers of a state with `update` method.

```ts
// Create state
const log = new State([])

// Subscribe to changes
new Watch(() => console.log(log.value)) // logs: []

log.value.push(1) // no logs

// Update value
log.update() // logs: [1]
```

### Raw value
###### [🏠︎](#index) / [State](#state) / Raw value [↑](#force-update-of-state) [↓](#stateset-experimental)

`rawValue` returns the current value but **doesn't subscribe** to changes — unlike `value` which auto-subscribes in `Watch`.

```ts
const foo = new State(0)
const bar = new State(0)

new Watch(() => console.log(foo.value, bar.rawValue))
// logs: 0, 0

foo.value++ // logs: 1, 0
bar.value++ // no logs
foo.value++ // logs: 2, 1
```

### State.set (experimental)
###### [🏠︎](#index) / [State](#state) / State.set [↑](#get-or-set-value)

`State.set` mirrors the behavior of the value setter but returns `void`.
It is useful as a shorthand in arrow functions: `() => state.set(nextValue)` instead of `() => { state.value = nextValue }`.

Note: `state.set` cannot be used as a standalone function; `const set = state.set` is not supported.

```ts
const count = new State(0)

// Subscribing
new Watch(() => console.log(count.value))
// log: 0

count.set(1) // triggers: log: 1
```

## Compute
###### [🏠︎](#index) / Compute [↑](#state) [↓](#utils)

<sup>[Lazy computation](#lazy-computation) • [Force update of Compute](#force-update-of-compute) • [Destroy Compute](#destroy-compute)</sup>

**Derived reactive state** that automatically recomputes when its dependencies change.  
**Lazy execution** — only computes when `.value` is accessed.

### Lazy computation
###### [🏠︎](#index) / [Compute](#compute) / Lazy computation [↓](#force-update-of-compute)

`Compute` doesn't execute immediately — waits for `.value` access.  
Dependencies (`State.value` reads inside callback) auto-subscribe like `Watch`.

```javascript
const name = new State('Foo')
const surname = new State('Bar')

const fullName = new Compute(() => (
  `${name.value} ${surname.value[0]}` // auto-subscribes to name+surname
))
// NO COMPUTATION YET — lazy!

new Watch(() => {
  console.log(fullName.value) // FIRST ACCESS → computes!
})
// logs: 'Foo B'

surname.value = 'Baz' // surname[0] still "B"
// nothing happens

surname.value = 'Quux' // surname[0] = "Q"
// logs: 'Foo Q'
```

**Benefits:**
- **Zero overhead** for unused computed values
- **Automatic dependency tracking** — no manual subscriptions
- **Cached result** — same `.value` reads return cached value

### Force update of Compute
###### [🏠︎](#index) / [Compute](#compute) / Force update of Compute [↑](#lazy-computation) [↓](#destroy-compute)

**Call `.update()` to manually trigger recomputation** — forces callback execution **even when no dependencies changed**.

**Perfect for:**
- **Array mutations** (`push`, `pop`, `splice`)
- **Object mutations** (adding properties)
- **External data refresh**
- **Debugging** stale values

```ts
const items = new State([])

const itemCount = new Compute(() => {
  console.log('🔄 Recomputing length...')
  return items.value.length
})

new Watch(() => console.log('Watcher sees:', itemCount.value))
// 🔄 Recomputing length...
// Watcher sees: 0

items.value.push('apple')  // ❌ Array reference SAME → NO recompute!
console.log('Direct length:', items.value.length) // 1
console.log(itemCount.value) // STALE: 0 ❌

itemCount.update()  // ✅ FORCES recompute
// 🔄 Recomputing length...
// Watcher sees: 1 ✅
```

### Destroy Compute
###### [🏠︎](#index) / [Compute](#compute) / Destroy Compute [↑](#force-update-of-compute)

Call `.destroy()` to completely stop reactivity — unsubscribes from all dependency states, clears cached value, and prevents any future recomputations.

Triggers `onDestroy` callbacks registered inside `Compute` callback:

```ts
const user = new State({ name: 'Alice', age: 30 })

const userName = new Compute(() => {
  console.log('Computing')

  onDestroy(() => {
    console.log('Cleanup')
  })

  return user.value.name.toUpperCase()
})

new Watch(() => console.log(userName.value))
// logs: Computing
// logs: ALICE

user.value = { name: 'Mike', age: 32 }
// logs: Cleanup
// logs: Computing
// logs: MIKE

userName.destroy()
// logs: Cleanup

user.value = { name: 'Bob', age: 31 }
// nothing happens — fully disconnected!
```

## Utils
###### [🏠︎](#index) / Utils [↑](#compute) [↓](#typescript)

<sup>[onDestroy](#ondestroy) • [callEvent](#callevent) • [createEvent](#createevent) • [unwatch](#unwatch)</sup>

### onDestroy
###### [🏠︎](#index) / [Utils](#utils) / onDestroy [↓](#callevent)

You can subscribe on destroy or update of watcher

```javascript
const count = new State(0)

const watcher = new Watch(() => {
  console.log('count', count.value)
  // the order does not matter
  onDestroy(() => console.log('destructor'))
})
// logs: 'count', 0

count.value++
// logs: 'destructor'
// logs: 'count', 1

watcher.destroy()
// logs: 'destructor'

count.value++
// nothing happens
```

### callEvent
###### [🏠︎](#index) / [Utils](#utils) / callEvent [↑](#ondestroy) [↓](#createevent)

**Immediately executes reactive effect** (unlike [createEvent](#createevent)).

Both `callEvent` and `createEvent`:
- **Ignores** automatic state subscriptions (`unwatch`)
- **Batches** state updates and **flushes queue** at the end
- Perfect for **side effects** and **mutations**

**Key differences:**
- `callEvent(fn)` → **executes NOW** and returns result
- `createEvent(fn)` → **returns reusable function**

```ts
const a = new State(0)
const b = new State(0)

new Watch(() => {
  console.log(a.value, b.value)
})
// logs: 0, 0

a.value = 1
// logs: 1, 0

b.value = 1
// logs: 1, 1

callEvent(() => {
  a.value = 2
  b.value = 2
})
// logs: 1, 1
```

`callEvent` executes your callback and returns exactly what your callback
returns — TypeScript infers the correct type automatically.

```ts
const count = new State(0)

new Watch(() => console.log(count.value))
// logs: 0

const prev = callEvent(() => count.value++)
// logs: 1

console.log(prev)
// logs: 0
```

### createEvent
###### [🏠︎](#index) / [Utils](#utils) / createEvent [↑](#callevent) [↓](#unwatch)

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

### unwatch
###### [🏠︎](#index) / [Utils](#utils) / unwatch [↑](#createevent)

**Disables automatic state subscriptions** by wrapping value access in `unwatch`.

**Unlike `callEvent`/`createEvent`**, `unwatch` does **NOT batch updates**.

```ts
import { State, Watch, unwatch } from 'watch-state'

const count = new State(0)

new Watch(() => {
  console.log(unwatch(() => count.value++))
})                       // logs: 0

count.value++            // logs: 1

console.log(count.value) // logs: 2
```

## Typescript
###### [🏠︎](#index) / Typescript [↑](#utils) [↓](#performance)

Generic of `State`
```typescript
const key = new State<string | number>()

key.value = false
// error, you can use only string or number
```
Generic of `Compute`
```typescript
new Compute<string>(() => false)
// error, target of `Compute` should return string
```

## Performance
###### [🏠︎](#index) / Performance [↑](#typescript)

You can check a performance test with **[MobX](https://www.npmjs.com/package/mobx)**, **[Effector](https://www.npmjs.com/package/effector)**, **[Storeon](https://www.npmjs.com/package/storeon)**, **[Nano Stores](https://www.npmjs.com/package/nanostores)**, **[Mazzard](https://www.npmjs.com/package/mazzard)** and **[Redux](https://www.npmjs.com/package/redux)**.
Clone the repo, install packages and run this command
```shell
npm run speed
```

## Links
You can find more tools [here](https://www.npmjs.com/search?q=%40watch-state)

## Issues
If you find a bug or have a suggestion, please file an issue on [GitHub](https://github.com/d8corp/watch-state/issues)

[![issues](https://img.shields.io/github/issues-raw/d8corp/watch-state)](https://github.com/d8corp/watch-state/issues)

