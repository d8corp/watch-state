# Changelog
## v2.0
To migrate from the first version please:
 - update to `2.0.0-migration`
 - fix all errors in the browser console or fix all deprecated functionality
 - update to the second version
### v2.0.0 [![10.01.2021](https://img.shields.io/date/1610235777)](https://github.com/d8corp/watch-state/tree/v2.0.0)
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
