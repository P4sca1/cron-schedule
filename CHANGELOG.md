## [5.0.1](https://github.com/P4sca1/cron-schedule/compare/v5.0.0...v5.0.1) (2024-04-29)


### Bug Fixes

* use nextTimeout variable ([0a067a8](https://github.com/P4sca1/cron-schedule/commit/0a067a8036c89da0ba210620a502dc937347541d))

# [5.0.0](https://github.com/P4sca1/cron-schedule/compare/v4.0.0...v5.0.0) (2024-04-29)


### Bug Fixes

* **getPrevDate:** the wrong result was sometimes returned for months with less than 31 days ([6537bc1](https://github.com/P4sca1/cron-schedule/commit/6537bc1605714b8bfc41fe0aa4ba00aaa459d4c0)), closes [#313](https://github.com/P4sca1/cron-schedule/issues/313)
* update dependencies, switch from eslint + prettier to biome, ([43c2868](https://github.com/P4sca1/cron-schedule/commit/43c2868d53d272bda6349c3b81c236c23249038e))


### BREAKING CHANGES

* Support for Node.js 16 is dropped, as it is End of Life.
Our code is tested against Node.js LTS release version 18 and 20.

There are a lot of changes in this commit, because of formatting changes (e.g. tabs instead of spaces).

Configured vitest to generate a junit test report, which is uploaded to CircleCI. The CI will now run biome check, which checks the code for linting and formatting issues.

Signed-off-by: Pascal Sthamer <10992664+P4sca1@users.noreply.github.com>

# [4.0.0](https://github.com/P4sca1/cron-schedule/compare/v3.0.6...v4.0.0) (2023-03-30)


### Bug Fixes

* correctly parse weekday ranges that include sunday ([#283](https://github.com/P4sca1/cron-schedule/issues/283)) ([2fb78b5](https://github.com/P4sca1/cron-schedule/commit/2fb78b57e7382f3c2bbde529f80bf8de5843062b))
* specify types for legacy support ([7288c13](https://github.com/P4sca1/cron-schedule/commit/7288c132d40b2270fa4d6aada2e31c345dfc3810))


### chore

* drop support for node14 ([d47ac6a](https://github.com/P4sca1/cron-schedule/commit/d47ac6aeeb439be73bf646455350c7d91d5b19f6))


### Features

* esm only build ([58cbdd7](https://github.com/P4sca1/cron-schedule/commit/58cbdd7af9ecf521093d5532ad174c8d69933cd7))


### BREAKING CHANGES

* If your environment does not support conditional exports, you have to import the schedulers from cron-schedule/dist/schedulers instead of cron-schedule/schedulers.

Signed-off-by: Pascal Sthamer <10992664+P4sca1@users.noreply.github.com>
* Support for node14 is dropped,
due to its EOL in the next month and missing ESM module support

Signed-off-by: Pascal Sthamer <10992664+P4sca1@users.noreply.github.com>
* The package is now ESM only. A CommonJS or IIFE build is no longer provided.
* The minimum required version of Node.js is now 14
* utils are no longer exposed
* schedulers are no longer exposed in the default entry point.
Import them from `cron-schedule/schedulers/interval-based.js` and
`cron-schedule/schedulers/timer-based.js` instead.

Signed-off-by: Pascal Sthamer <10992664+P4sca1@users.noreply.github.com>

# [4.0.0-next.3](https://github.com/P4sca1/cron-schedule/compare/v4.0.0-next.2...v4.0.0-next.3) (2023-03-30)


### Bug Fixes

* correctly parse weekday ranges that include sunday ([#283](https://github.com/P4sca1/cron-schedule/issues/283)) ([2fb78b5](https://github.com/P4sca1/cron-schedule/commit/2fb78b57e7382f3c2bbde529f80bf8de5843062b))

# [4.0.0-next.2](https://github.com/P4sca1/cron-schedule/compare/v4.0.0-next.1...v4.0.0-next.2) (2023-03-30)


### Bug Fixes

* specify types for legacy support ([7288c13](https://github.com/P4sca1/cron-schedule/commit/7288c132d40b2270fa4d6aada2e31c345dfc3810))


### BREAKING CHANGES

* If your environment does not support conditional exports, you have to import the schedulers from cron-schedule/dist/schedulers instead of cron-schedule/schedulers.

Signed-off-by: Pascal Sthamer <10992664+P4sca1@users.noreply.github.com>

# [4.0.0-next.1](https://github.com/P4sca1/cron-schedule/compare/v3.0.6...v4.0.0-next.1) (2023-03-30)


### chore

* drop support for node14 ([d47ac6a](https://github.com/P4sca1/cron-schedule/commit/d47ac6aeeb439be73bf646455350c7d91d5b19f6))


### Features

* esm only build ([58cbdd7](https://github.com/P4sca1/cron-schedule/commit/58cbdd7af9ecf521093d5532ad174c8d69933cd7))


### BREAKING CHANGES

* Support for node14 is dropped,
due to its EOL in the next month and missing ESM module support

Signed-off-by: Pascal Sthamer <10992664+P4sca1@users.noreply.github.com>
* The package is now ESM only. A CommonJS or IIFE build is no longer provided.
* The minimum required version of Node.js is now 14
* utils are no longer exposed
* schedulers are no longer exposed in the default entry point.
Import them from `cron-schedule/schedulers/interval-based.js` and
`cron-schedule/schedulers/timer-based.js` instead.

Signed-off-by: Pascal Sthamer <10992664+P4sca1@users.noreply.github.com>

## [3.0.6](https://github.com/P4sca1/cron-schedule/compare/v3.0.5...v3.0.6) (2022-04-27)


### Bug Fixes

* cron.matchDate always returning true for day of month, when either weekday or day of month is unrestricted ([#271](https://github.com/P4sca1/cron-schedule/issues/271)) ([8ebd6a6](https://github.com/P4sca1/cron-schedule/commit/8ebd6a63acc2ea2bb1f77f23bf9158010258ed44)), closes [#270](https://github.com/P4sca1/cron-schedule/issues/270) [#270](https://github.com/P4sca1/cron-schedule/issues/270)

## [3.0.5](https://github.com/P4sca1/cron-schedule/compare/v3.0.4...v3.0.5) (2022-02-25)


### Bug Fixes

* relax allowed ranges to be compatible with linux spec ([34466d4](https://github.com/P4sca1/cron-schedule/commit/34466d4fe25f0a170a65266b3741371db95f382b))

## [3.0.4](https://github.com/P4sca1/cron-schedule/compare/v3.0.3...v3.0.4) (2021-10-28)


### Bug Fixes

* include mjs files in npm build ([1985874](https://github.com/P4sca1/cron-schedule/commit/19858745af5d1827db9453eddca5ef4a775b3ed1))
* use unknown for error type ([5623e65](https://github.com/P4sca1/cron-schedule/commit/5623e652aa5dd1265db220708f26c2de0f7e96ae))

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
