## [3.0.3](https://github.com/P4sca1/cron-schedule/compare/v3.0.2...v3.0.3) (2021-08-17)


### Bug Fixes

* rename module file extension to .mjs ([53993b1](https://github.com/P4sca1/cron-schedule/commit/53993b193689943be50f7b2ec39d396d1d14fa65)), closes [#159](https://github.com/P4sca1/cron-schedule/issues/159)

## [3.0.2](https://github.com/P4sca1/cron-schedule/compare/v3.0.1...v3.0.2) (2021-06-25)


### Bug Fixes

* detect step values smaller than 1 ([8f53df9](https://github.com/P4sca1/cron-schedule/commit/8f53df946fc6decc709cbeb77740541b84920d30)), closes [#134](https://github.com/P4sca1/cron-schedule/issues/134)

## [3.0.1](https://github.com/P4sca1/cron-schedule/compare/v3.0.0...v3.0.1) (2021-02-23)


### Bug Fixes

* fix files missing in npm bundle ([00c173b](https://github.com/P4sca1/cron-schedule/commit/00c173bd818a884e223a58ec5a675774775e1813))

# [3.0.0](https://github.com/P4sca1/cron-schedule/compare/v2.2.4...v3.0.0) (2021-02-23)


### Features

* add error handling to tasks ([375a6b8](https://github.com/P4sca1/cron-schedule/commit/375a6b8ce211af6ec09ad280899e129eb89d9289)), closes [#80](https://github.com/P4sca1/cron-schedule/issues/80)
* expose ECMAScript module ([e73fadc](https://github.com/P4sca1/cron-schedule/commit/e73fadc2a031cb768f4212d06dd39f2a44b023dd))


### BREAKING CHANGES

* The third argument to IntervalBasedScheduler.registerTask is no longer isOneTimeTask.
Instead it is an object where one attribute is the old isOneTimeTask parameter.

Signed-off-by: Pascal Sthamer <sthamer.pascal@gmail.com>

## [2.2.4](https://github.com/P4sca1/cron-schedule/compare/v2.2.3...v2.2.4) (2020-11-21)


### Bug Fixes

* fix package.json exports ([c172cdc](https://github.com/P4sca1/cron-schedule/commit/c172cdcc4a6bf14aef3e32831a921c0725336263))

## [2.2.3](https://github.com/P4sca1/cron-schedule/compare/v2.2.2...v2.2.3) (2020-11-20)


### Bug Fixes

* fix typo in comment ([499afc2](https://github.com/P4sca1/cron-schedule/commit/499afc2d1b91ae0e5250ba4b78ef8c274a942db6))

## [2.2.2](https://github.com/P4sca1/cron-schedule/compare/v2.2.1...v2.2.2) (2020-11-20)


### Bug Fixes

* **deps:** update yarn.lock ([e22b7cc](https://github.com/P4sca1/cron-schedule/commit/e22b7cc5d2c87b30c6f72625a7803951b4eddb14))

## [2.2.1](https://github.com/P4sca1/cron-schedule/compare/v2.2.0...v2.2.1) (2020-11-20)


### Bug Fixes

* **deps:** regenerate yarn.lock ([ef1e3fe](https://github.com/P4sca1/cron-schedule/commit/ef1e3fe414bbcc5fd6ee974f300c6d1960382f7a))

## 2.1.0
* Slightly improve performance of the interval based scheduler.
* Add methods to iterate over next and previous dates: `cron.getNextDatesIterator` and `cron.getPrevdatesIterator()`

## 2.0.2
* Mark library as side effect free to support tree shaking.

## 2.0.1
* Improved compatibility with bundlers like webpack.

## 2.0.0
* Renamed `Schedule` to `Cron`.
* New `IntervalBasedCronScheduler`.
* Moved `setTimeout`, `setInterval` and `clearTimeoutOrInterval` to `TimerBasedCronScheduler`.

See `README.md` for instructions on how to use the new scheduler.

**Quick migration guide:**
```ts
// v1.x
import { parseCronExpression } from 'cron-schedule'

const schedule = parseCronExpression('* * * * *')
schedule.setTimeout(fn)
schedule.setInterval(fn)
schedule.clearTimeoutOrInterval(id)


// v2.x
import { parseCronExpression, TimerBasedCronScheduler as scheduler } from 'cron-schedule'

const cron = parseCronExpression('* * * * *')
scheduler.setTimeout(cron, fn)
scheduler.setInterval(cron, fn)
scheduler.clearTimeoutOrInterval(id)
```

## 1.0.2
* Publish type declarations to npm.

## 1.0.1
* Publish source maps to npm.
