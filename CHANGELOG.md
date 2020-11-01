# Changelog

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