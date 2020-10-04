**This project is still work in progress and is not usable at the moment.**
Feel free to press the Watch button to get notified, when this project becomes usable.

# cron-schedule ![CircleCI](https://circleci.com/gh/P4sca1/cron-schedule.svg?style=svg)
A zero-dependency cron scheduler for Node.js and the browser.

## Features
* Parse cron expressions.
* Get next or previous schedules from a specific starting date.
* Check if a date matches a cron expression.
* Schedule a function call based on a cron expression.

## Installation for usage in Node.js or in the browser via bundlers
Via npm:

`$ npm install cron-schedule`

Via yarn:

`$ yarn add cron-schedule`

**We test our code against active Node.js LTS releases (`10.22`, `12.18`, `14.13`).**
Other versions of node.js may also work, but this is not tested.

## Installation for usage in the browser without a bundler
`<script src="https://unpkg.com/cron-schedule@:version"></script>`

Replace `:version` with the desired version. Semver ranges are supported. To always use the latest `1.x` version use `^1.0.0`.
See [Releases](https://github.com/P4sca1/cron-schedule/releases) for a list of available versions.

After the script has been loaded, you can use the global `cronSchedule` object to access the API.

**Requires ES6 (ES2015) browser support. Internet Explorer is not supported.** If you need to support older browsers, get _cron-schedule_ via npm or yarn and transpile it with your bundler.

## Usage
### Parse a cron expression to return an instance of `Schedule`
```ts
import { parseCronExpression } from 'cron-schedule'
const schedule = parseCronExpression('0 * * * * *') // In the browser: cronSchedule.parseCronExpression
```

### Get the next scheduled date starting from the given start date or now.
```ts
schedule.getNextDate(startDate?: Date): Date
```

### Get the specified amount of future scheduled dates starting from the given start date or now.
```ts
schedule.getNextDates(amount: number, startDate?: Date): Date[]
```

### Get the previously scheduled date starting from the given start date or now.
```ts
schedule.getPrevDate(startDate: Date = new Date()): Date
```

### Get the specified amount of previously scheduled dates starting from the given start date or now.
```ts
schedule.getPrevDates(amount: number, startDate?: Date): Date[]
```

### Check whether there is a schedule on a given date.
Returns true when there is a schedule at the given date.
```ts
schedule.matchDate(date: Date): boolean
```

### Create a timeout, which will fire the given function on the next schedule.
Returns a `handle` which can be used to clear the timeout using `clearTimeoutOrInterval`.
```ts
schedule.setTimeout(fn: () => void): ITimerHandle
```

### Create an interval, which will fire the given function on every future schedule.
Returns a `handle` which can be used to clear the interval using `clearTimeoutOrInterval`.
The `handle` parameter can be ignored. It is used internally to keep the timeoutId in the handle up to date.
```ts
schedule.setInterval(fn: () => void, handle?: ITimerHandle): ITimerHandle
```

### Clear a timeout or interval, making sure that the function will no longer execute.
```ts
schedule.clearTimeoutOrInterval(handle: ITimerHandle): void
```

## Cron expression format
_cron_schedule_ uses the linux cron syntax as described [here](https://man7.org/linux/man-pages/man5/crontab.5.html) with the addition that you can optionally
specify seconds by prepending the minute field with another field.

All linux cron features are supported, including

* lists
* ranges
* ranges in lists
* step values
* month names (fan,feb,... - case insensitive)
* weekday names (mon,tue,... - case insensitive)
* time nicknames (@yearly, @annually, @monthly, @weekly, @daily, @hourly - case insensitive)

**Instead of using * * * * * * for a job that runs every second, you should consider using `setInterval(cb, 1000)` which is more suitable for such a simple timing task, because due to the calculation overhead, there would likely be delays when using cron.**

## Cron validation
Looking for a way to validate cron expressions in your backend (node.js) or in the browser with support for multiple presets? Check out [cron-validate](https://github.com/airfooox/cron-validate)!

Use the `npm-cron-schedule` preset to validate that cron expressions are supported by _cron-schedule_.