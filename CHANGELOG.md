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

## 1.0.0 (2024-07-15)


### ⚠ BREAKING CHANGES

* Support for Node.js 16 is dropped, as it is End of Life. Our code is tested against Node.js LTS release version 18 and 20.
* If your environment does not support conditional exports, you have to import the schedulers from cron-schedule/dist/schedulers instead of cron-schedule/schedulers.
* Support for node14 is dropped, due to its EOL in the next month and missing ESM module support
* The package is now ESM only. A CommonJS or IIFE build is no longer provided. The minimum required version of Node.js is now 14 utils are no longer exposed schedulers are no longer exposed in the default entry point. Import them from `cron-schedule/schedulers/interval-based.js` and `cron-schedule/schedulers/timer-based.js` instead.
* 

### Features

* add error handling to tasks ([375a6b8](https://github.com/SolinkCorp/cron-schedule/commit/375a6b8ce211af6ec09ad280899e129eb89d9289))
* add methods to iterate over next and previous dates ([33dae96](https://github.com/SolinkCorp/cron-schedule/commit/33dae96a9d5c064d31a4c80574d5caa4050d9b73)), closes [#24](https://github.com/SolinkCorp/cron-schedule/issues/24)
* define public api ([3b48e40](https://github.com/SolinkCorp/cron-schedule/commit/3b48e40c1b458d48d950dbf27b2bf6ada973c8ed))
* esm only build ([58cbdd7](https://github.com/SolinkCorp/cron-schedule/commit/58cbdd7af9ecf521093d5532ad174c8d69933cd7))
* expose ECMAScript module ([fe730b6](https://github.com/SolinkCorp/cron-schedule/commit/fe730b61898c67d6fdfa3380da6c7e0d48909599))
* expose ECMAScript module ([e73fadc](https://github.com/SolinkCorp/cron-schedule/commit/e73fadc2a031cb768f4212d06dd39f2a44b023dd))
* finish getNext/PrevDate algorithms ([494188e](https://github.com/SolinkCorp/cron-schedule/commit/494188e66e5bd320c946314159536d0c93ee3add))
* implement cron parser ([30a2d9d](https://github.com/SolinkCorp/cron-schedule/commit/30a2d9d8426ff22e4f80f8c6e7ee6200b8811bf9))
* improve processTasks performance ([3a99f26](https://github.com/SolinkCorp/cron-schedule/commit/3a99f267453db81db5bf5b3bced49f7158fe44dd)), closes [#25](https://github.com/SolinkCorp/cron-schedule/issues/25)
* interval based scheduler ([74d4742](https://github.com/SolinkCorp/cron-schedule/commit/74d4742428dabefba2f88d6050ba359faec47dcc))
* long timeout ([7f21e06](https://github.com/SolinkCorp/cron-schedule/commit/7f21e066a2d2e269cdc54c6506862a4914d632c5))
* matchDate, getNextDates, getPrevDates, initial work on main algo ([c6334b6](https://github.com/SolinkCorp/cron-schedule/commit/c6334b6372cd9841de37e47145246c0442244f92))
* remove [@secondly](https://github.com/secondly) time nickname ([970d1b1](https://github.com/SolinkCorp/cron-schedule/commit/970d1b166057cffb1dd06b91203bd69ec97e609c))
* schedule nextDates and prevDates without weekday ([3db786c](https://github.com/SolinkCorp/cron-schedule/commit/3db786cf583193211eb813a5b5fd92de8156e1dc))
* schedule validation and smaller improvements ([4c5d5eb](https://github.com/SolinkCorp/cron-schedule/commit/4c5d5ebdbec168c13a8c58362db757db6ef6286b))
* support seconds in schedule ([3f6de33](https://github.com/SolinkCorp/cron-schedule/commit/3f6de339bf75e17fa175172540f3614adb355581))


### Bug Fixes

* adding github workflow for build/release ([83ed752](https://github.com/SolinkCorp/cron-schedule/commit/83ed752af8cb5bb47adbf1826117d51aa4e3615c))
* build errors ([fb93873](https://github.com/SolinkCorp/cron-schedule/commit/fb93873990a8aeb568f315e7799cc60011d23c79))
* correctly parse weekday ranges that include sunday ([#283](https://github.com/SolinkCorp/cron-schedule/issues/283)) ([2fb78b5](https://github.com/SolinkCorp/cron-schedule/commit/2fb78b57e7382f3c2bbde529f80bf8de5843062b))
* cron.matchDate always returning true for day of month, when either weekday or day of month is unrestricted ([#271](https://github.com/SolinkCorp/cron-schedule/issues/271)) ([8ebd6a6](https://github.com/SolinkCorp/cron-schedule/commit/8ebd6a63acc2ea2bb1f77f23bf9158010258ed44))
* **deps:** pin dependency @rollup/plugin-typescript to 6.0.0 ([#1](https://github.com/SolinkCorp/cron-schedule/issues/1)) ([a04dbdc](https://github.com/SolinkCorp/cron-schedule/commit/a04dbdc6e1f13d1d0207f9d21a690176c1a5f260))
* **deps:** regenerate yarn.lock ([ef1e3fe](https://github.com/SolinkCorp/cron-schedule/commit/ef1e3fe414bbcc5fd6ee974f300c6d1960382f7a))
* **deps:** remove @rollup/plugin-typescript dependency ([2a38daa](https://github.com/SolinkCorp/cron-schedule/commit/2a38daa1e8cadb121a07f6bf6b81519397383fa7))
* **deps:** update yarn.lock ([e22b7cc](https://github.com/SolinkCorp/cron-schedule/commit/e22b7cc5d2c87b30c6f72625a7803951b4eddb14))
* detect step values smaller than 1 ([8f53df9](https://github.com/SolinkCorp/cron-schedule/commit/8f53df946fc6decc709cbeb77740541b84920d30)), closes [#134](https://github.com/SolinkCorp/cron-schedule/issues/134)
* do not return interval id when starting the interval scheduler ([d0d946b](https://github.com/SolinkCorp/cron-schedule/commit/d0d946bcc774b96fcd5b1fed7ebdc01d5e8cc296))
* do not specify browser in package.json ([b741694](https://github.com/SolinkCorp/cron-schedule/commit/b74169455c898bbd748aaab741665dee533f5c81))
* fix error when trying to get the prev date of the first of a month ([ff9e722](https://github.com/SolinkCorp/cron-schedule/commit/ff9e722d27651edcfc021e9bf0a7c9009d90d5f4))
* fix files missing in npm bundle ([00c173b](https://github.com/SolinkCorp/cron-schedule/commit/00c173bd818a884e223a58ec5a675774775e1813))
* fix package.json exports ([c172cdc](https://github.com/SolinkCorp/cron-schedule/commit/c172cdcc4a6bf14aef3e32831a921c0725336263))
* fix typing of iterator methods and add documentation ([3dbb7c9](https://github.com/SolinkCorp/cron-schedule/commit/3dbb7c92020b320228ed7f4941fbd64f8cf05e95))
* fix typo in comment ([499afc2](https://github.com/SolinkCorp/cron-schedule/commit/499afc2d1b91ae0e5250ba4b78ef8c274a942db6))
* **getPrevDate:** the wrong result was sometimes returned for months with less than 31 days ([6537bc1](https://github.com/SolinkCorp/cron-schedule/commit/6537bc1605714b8bfc41fe0aa4ba00aaa459d4c0)), closes [#313](https://github.com/SolinkCorp/cron-schedule/issues/313)
* include mjs files in npm build ([1985874](https://github.com/SolinkCorp/cron-schedule/commit/19858745af5d1827db9453eddca5ef4a775b3ed1))
* mark library as side effect free ([57cdf61](https://github.com/SolinkCorp/cron-schedule/commit/57cdf61a3d7229b50cb1d06430f47aec2db2d034))
* relax allowed ranges to be compatible with linux spec ([34466d4](https://github.com/SolinkCorp/cron-schedule/commit/34466d4fe25f0a170a65266b3741371db95f382b))
* remove accidently pushed code for iterator method ([cfc5032](https://github.com/SolinkCorp/cron-schedule/commit/cfc5032f550a859d4d54c6e5848d802dc874c80c))
* rename module file extension to .mjs ([53993b1](https://github.com/SolinkCorp/cron-schedule/commit/53993b193689943be50f7b2ec39d396d1d14fa65)), closes [#159](https://github.com/SolinkCorp/cron-schedule/issues/159)
* specify types for legacy support ([7288c13](https://github.com/SolinkCorp/cron-schedule/commit/7288c132d40b2270fa4d6aada2e31c345dfc3810))
* support commonjs build ([fbabf4c](https://github.com/SolinkCorp/cron-schedule/commit/fbabf4cbdac947ca75809c211d74077c34ce36e6))
* update dependencies, switch from eslint + prettier to biome, ([43c2868](https://github.com/SolinkCorp/cron-schedule/commit/43c2868d53d272bda6349c3b81c236c23249038e))
* update publish command to use pnpm ([1c41dc5](https://github.com/SolinkCorp/cron-schedule/commit/1c41dc51c9630d7755a314a84bb7d99cae87e800))
* update version to 1.0.0 ([ba45594](https://github.com/SolinkCorp/cron-schedule/commit/ba45594d7c17db24816b6d7622a07e2b806940b6))
* use nextTimeout variable ([0a067a8](https://github.com/SolinkCorp/cron-schedule/commit/0a067a8036c89da0ba210620a502dc937347541d))
* use unknown for error type ([5623e65](https://github.com/SolinkCorp/cron-schedule/commit/5623e652aa5dd1265db220708f26c2de0f7e96ae))


### Miscellaneous Chores

* drop support for node14 ([d47ac6a](https://github.com/SolinkCorp/cron-schedule/commit/d47ac6aeeb439be73bf646455350c7d91d5b19f6))

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
