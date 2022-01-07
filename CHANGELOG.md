# Changelog

## v3.4
### v3.4.1 [![07.01.2022](https://img.shields.io/date/1641557981)](https://github.com/d8corp/watch-state/tree/v3.4.1)
- added `size` field of `Cache` which returns count of subscribers

### v3.4.0 [![07.08.2021](https://img.shields.io/date/1628363458)](https://github.com/d8corp/watch-state/tree/v3.4.0)
- fixed bug of deep event using, in watcher and during another event
- fixed types of `scope`, added `Scope` type
- removed all default exports

## v3.3
### v3.3.3 [![10.07.2021](https://img.shields.io/date/1625939894)](https://github.com/d8corp/watch-state/tree/v3.3.3)
- fixed bug of `globalEvent`

### v3.3.2 [![10.07.2021](https://img.shields.io/date/1625937176)](https://github.com/d8corp/watch-state/tree/v3.3.2)
- added `scope` export

### v3.3.1 [![10.07.2021](https://img.shields.io/date/1625934996)](https://github.com/d8corp/watch-state/tree/v3.3.1)
- updated readme

### v3.3.0 [![10.07.2021](https://img.shields.io/date/1625932821)](https://github.com/d8corp/watch-state/tree/v3.3.0)
Stable version
- normalized watchers running flow
- fixed deep bugs
- added `globalEvent`
- unfortunately, the performance has decreased, but the current version is strong stable and still, this is one of the fastest solutions. 

## v3.2
### v3.2.3 [![07.07.2021](https://img.shields.io/date/1625771432)](https://github.com/d8corp/watch-state/tree/v3.2.3)
- fixed deep unwatched cache updating bag
```typescript
const state = new State(0)
const cache1 = new Cache(() => state.value)
const cache2 = new Cache(() => cache1.value)

console.log(cache2.value) //0

state.value = 1

console.log(cache2.value) //1 (before: 0)
```

### v3.2.2 [![07.07.2021](https://img.shields.io/date/1625649464)](https://github.com/d8corp/watch-state/tree/v3.2.2)
- fixed infinite loop bug when you change that value you watch
```typescript
const count = new State(0)

new Watch(() => {
  if (count.value < 2) {
    console.log(count.value++)
  }
})
// now you have `1` and `0` in console, before it was infinite loop
```

### v3.2.1 [![07.07.2021](https://img.shields.io/date/1625612254)](https://github.com/d8corp/watch-state/tree/v3.2.1)
- fixed readme icons

### v3.2.0 [![07.07.2021](https://img.shields.io/date/1625611434)](https://github.com/d8corp/watch-state/tree/v3.2.0)
- fixed bug when you change and ask cache value inside an event
```typescript
const event = new Event()
const state = new State(1)
const cache = new Cache(() => state.value)

console.log(cache.value)
// 1

event.start()

state.value = 2

console.log(cache.value)
// 2 (before: 1)

event.end()
```
- decreased [weight](https://bundlephobia.com/package/watch-state)
- increased [performance](https://github.com/d8corp/watch-state#performance)
> Now **watch-state** faster than **redux** in [complex](https://github.com/d8corp/watch-state/blob/v3.2.0/speed.test.ts#L181) case

## v3.1
### v3.1.4 [![26.06.2021](https://img.shields.io/date/1624730252)](https://github.com/d8corp/watch-state/tree/v3.1.4)
- fixed misprint bug of previous release

### v3.1.3 [![26.06.2021](https://img.shields.io/date/1624727511)](https://github.com/d8corp/watch-state/tree/v3.1.3)
- improved using of `events` inside a `watcher`

### v3.1.2 [![26.06.2021](https://img.shields.io/date/1624721815)](https://github.com/d8corp/watch-state/tree/v3.1.2)
- fixed a bug relates to the previous release

### v3.1.1 [![26.06.2021](https://img.shields.io/date/1624708139)](https://github.com/d8corp/watch-state/tree/v3.1.1)
- fixed a bug relates to the previous release

### v3.1.0 [![26.06.2021](https://img.shields.io/date/1624697477)](https://github.com/d8corp/watch-state/tree/v3.1.0)
- now `events` ignore watching, so you can use them inside watchers.

## v3.0
### v3.0.5 [![26.06.2021](https://img.shields.io/date/1624665964)](https://github.com/d8corp/watch-state/tree/v3.0.5)
- fixed empty event running bug

### v3.0.4 [![14.06.2021](https://img.shields.io/date/1623676637)](https://github.com/d8corp/watch-state/tree/v3.0.4)
- fixed circular dependency bug

### v3.0.3 [![07.06.2021](https://img.shields.io/date/1623095628)](https://github.com/d8corp/watch-state/tree/v3.0.3)
- fixed a bug of importing

### v3.0.2 [![07.06.2021](https://img.shields.io/date/1623091679)](https://github.com/d8corp/watch-state/tree/v3.0.2)
- removed baseUrl using

### v3.0.1 [![01.06.2021](https://img.shields.io/date/1622501057)](https://github.com/d8corp/watch-state/tree/v3.0.1)
- updated readme

### v3.0.0 [![30.05.2021](https://img.shields.io/date/1622401326)](https://github.com/d8corp/watch-state/tree/v3.0.0)
Now, `update` method of `Cache` do not update it immediately, only if you use cache value inside a watcher.

- reduced utils, use [@watch-state/utils](https://github.com/d8corp/watch-state-utils)
- reduced decorators, use [@watch-state/decorators](https://github.com/d8corp/watch-state-decorators)
- changed `destructor` to `destroy`
- added `Event` class
- deep refactoring

## v2.0
To migrate from the first version please:
 - update to `2.0.0-migration`
 - fix all errors in the browser console or fix all deprecated functionality
 - update to the second version

### v2.0.2 [![17.03.2021](https://img.shields.io/date/1616008072)](https://github.com/d8corp/watch-state/tree/v2.0.2)
- reduced code

### v2.0.1 [![15.01.2021](https://img.shields.io/date/1610742353)](https://github.com/d8corp/watch-state/tree/v2.0.1)
- removed cache decorator using with methods

### v2.0.0 [![10.01.2021](https://img.shields.io/date/1610305726)](https://github.com/d8corp/watch-state/tree/v2.0.0)
- removed deprecated code

## v1.2
### v1.2.0 [![10.01.2021](https://img.shields.io/date/1610235777)](https://github.com/d8corp/watch-state/tree/v1.2.0)
- reduced code
- deprecated mixer
- added `getState` and `getCache`

## v1.1
### v1.1.1 [![02.01.2021](https://img.shields.io/date/1609546969)](https://github.com/d8corp/watch-state/tree/v1.1.1)
- fixed a bug when a state in a cache in a watcher in a watcher which uses the state.
```typescript
const log = []
const state = new State(1)
const cache = new Cache(() => state.value + 1)

new Watch(() => {
  if (state.value) {
    new Watch(() => log.push(cache.value))
  }
})
expect(log).toEqual([2])

state.value = 0
expect(log).toEqual([2]) // was [2, 1]
```

### v1.1.0 [![12.12.2020](https://img.shields.io/date/1607790401)](https://github.com/d8corp/watch-state/tree/v1.1.0)
- added `getDecor` and `getDecors`
- deprecated `stateValues`

## v1.0
### v1.0.4 [![24.11.2020](https://img.shields.io/date/1606251184)](https://github.com/d8corp/watch-state/tree/v1.0.4)
- fixed loop bug
- fixed `mixer` bugs

### v1.0.3 [![23.11.2020](https://img.shields.io/date/1606154418)](https://github.com/d8corp/watch-state/tree/v1.0.3)
- removed watching in event

### v1.0.2 [![21.11.2020](https://img.shields.io/date/1605944067)](https://github.com/d8corp/watch-state/tree/v1.0.2)
- fixed an exception error
- small improvements

### v1.0.1 [![19.11.2020](https://img.shields.io/date/1605817142)](https://github.com/d8corp/watch-state/tree/v1.0.1)
- fixed cache in cache bug

### v1.0.0 [![17.11.2020](https://img.shields.io/date/1605636703)](https://github.com/d8corp/watch-state/tree/v1.0.0)
