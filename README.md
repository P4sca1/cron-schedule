# cron-schedule

[![Release](https://github.com/P4sca1/cron-schedule/actions/workflows/release.yml/badge.svg)](https://github.com/P4sca1/cron-schedule/actions/workflows/release.yml)
[![npm](https://img.shields.io/npm/v/cron-schedule?style=flat-square)](https://www.npmjs.com/package/cron-schedule)
[![JSR](https://jsr.io/badges/@p4sca1/cron-schedule)](https://jsr.io/@p4sca1/cron-schedule)
![ts](https://flat.badgen.net/badge/-/TypeScript?icon=typescript&label&labelColor=blue&color=555555)
![](https://img.shields.io/npm/dw/cron-schedule?style=flat-square)

A zero-dependency cron parser and scheduler for Node.js, Deno, Bun and the browser. Published on [npm](https://www.npmjs.com/package/cron-schedule) and [JSR](https://jsr.io/@p4sca1/cron-schedule).

## Features

- Parse cron expressions.
- Get next or previous schedules from a specific starting date.
- Check if a date matches a cron expression.
- Schedule a function call based on a cron expression.
- Supports Node.js, Deno, Bun and the browser (ESM only)
- [Lightweight](https://bundlephobia.com/result?p=cron-schedule@latest) and tree-shakeable.

## Installation and usage

**We test our code against Node.js `22`, `24` and `26`, Deno `2` and Bun `1`.**
Other versions may also work, but this is not tested.

### Node.js

Via npm:

`$ npm install cron-schedule`

Via yarn:

`$ yarn add cron-schedule`

Via pnpm:

`$ pnpm add cron-schedule`

##### Usage

```ts
import { parseCronExpression } from 'cron-schedule'
const cron = parseCronExpression('*/5 * * * *')
console.log(cron.getNextDate(new Date(2020, 10, 20, 18, 32)))
// 2020-11-20T17:35:00.000Z
```

### Deno

Use `deno add jsr:@p4sca1/cron-schedule` and import from `@p4sca1/cron-schedule`, or import from `jsr:@p4sca1/cron-schedule@:version` without an install step:

```ts
import { parseCronExpression } from 'jsr:@p4sca1/cron-schedule@:version'
const cron = parseCronExpression('*/5 * * * *')
console.log(cron.getNextDate(new Date(2020, 10, 20, 18, 32)))
// 2020-11-20T17:35:00.000Z
```

On JSR, the schedulers are available as `@p4sca1/cron-schedule/schedulers/timer-based` and `@p4sca1/cron-schedule/schedulers/interval-based` (without `.js` extension).
Importing the npm package via `npm:cron-schedule@:version` works as well.

### Bun

`$ bun add cron-schedule`

The usage is the same as for Node.js.

### Cloudflare Workers

Install the npm package (or the JSR package via `npx jsr add @p4sca1/cron-schedule`). The usage is the same as for Node.js.

Workers always run in UTC. The schedulers only run while the Worker is active (e.g. during a request), so use [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) for recurring jobs. Parsing cron expressions and calculating dates works without restrictions.

### Browser via CDN

```html
<script type="module">
  import { parseCronExpression } from 'https://cdn.jsdelivr.net/npm/cron-schedule@:version/+esm'
  const cron = parseCronExpression('*/5 * * * *')
  console.log(cron.getNextDate(new Date(2020, 10, 20, 18, 32)))
  // 2020-11-20T17:35:00.000Z
</script>
```

The example above uses [jsDelivr](https://www.jsdelivr.com).

### Note on :version placeholder

The Deno import and CDN urls contain a `:version` placeholder. Replace `:version` with the desired version. Semver ranges are supported. To always use the latest `7.x` version use `^7.0.0`.
See https://www.npmjs.com/package/cron-schedule or https://jsr.io/@p4sca1/cron-schedule for a list of available versions.

## Work with cron expressions

```ts
// Import method to parse a cron expression.
import { parseCronExpression } from 'cron-schedule'

// Parse a cron expression to return a Cron instance.
const cron = parseCronExpression('*/5 * * * *')

// Get the next date starting from the given start date or now.
cron.getNextDate(startDate?: Date): Date

// Get the specified amount of future dates starting from the given start date or now.
cron.getNextDates(amount: number, startDate?: Date): Date[]

// Get an ES6 compatible iterator which iterates over the next dates starting from startDate or now.
// The iterator runs until the optional endDate is reached or forever.
// The advantage of an iterator is that you can get more further dates on demand by using iterator.next().
cron.getNextDatesIterator(startDate: Date = new Date(), endDate?: Date): Generator<Date, undefined, undefined>

// Get the previou date starting from the given start date or now.
cron.getPrevDate(startDate: Date = new Date()): Date

// Get the specified amount of previous dates starting from the given start date or now.
cron.getPrevDates(amount: number, startDate?: Date): Date[]

// Get an ES6 compatible iterator which iterates over the previous dates starting from startDate or now.
// The iterator runs until the optional endDate is reached or forever.
// The advantage of an iterator is that you can get more previous dates on demand by using iterator.next().
cron.getPrevDatesIterator(startDate: Date = new Date(), endDate?: Date): Generator<Date, undefined, undefined>

// Check whether there is a cron date at the given date.
cron.matchDate(date: Date): boolean
```

## Schedule tasks based on cron expressions

You can schedule tasks to be executed based on a cron expression. _cron-schedule_ comes with 2 different schedulers.

If you use TypeScript, version 5.0 or newer is required and `compilerOptions.moduleResolution` must be set to `node16`, `nodenext` or `bundler`.

### 1. Timer based scheduler

The timer based cron scheduler creates one timer for every scheduled cron.
When the node timeout limit of ~24 days would be exceeded, it uses multiple consecutive timeouts.

```ts
// Import the scheduler.
import { TimerBasedCronScheduler as scheduler } from 'cron-schedule/schedulers/timer-based.js'

// Create a timeout, which will fire the task on the next cron date.
// An optional errorHandler can be provided, which is called when the task throws an error or returns a promise that gets rejected.
// Returns a handle which can be used to clear the timeout using clearTimeoutOrInterval.
scheduler.setTimeout(cron: Cron, task: () => unknown, opts?: { errorHandler?: (err: Error) => unknown }): ITimerHandle

// Create an interval, which will fire the given task on every future cron date.
// This uses consecutive calls to scheduler.setTimeout under the hood.
// An optional errorHandler can be provided, which is called when the task throws an error or returns a promise that gets rejected.
// The task remains scheduled when an error occurs.
// Returns a handle which can be used to clear the timeout using clearTimeoutOrInterval.
scheduler.setInterval(cron: Cron, task: () => unknown, opts?: { errorHandler?: (err: Error) => unknown }): ITimerHandle

// Clear a timeout or interval, making sure that the task will no longer execute.
scheduler.clearTimeoutOrInterval(handle: ITimerHandle): void
```

**Pros:**

- A task is scheduled exactly to the second of the next cron date.

**Cons:**

- There is one timer per task, which could lead to lower performance compared to the interval based scheduler if you have many scheduled tasks.

### 2. Interval based scheduler

The interval based scheduler checks for due task in a fixed interval. So there is only one interval for all tasks assigned to a scheduler.
You can have multiple instances of an interval based scheduler.

```ts
// Import the scheduler.
import { IntervalBasedCronScheduler } from 'cron-schedule/schedulers/interval-based.js'

// Instantiate a new instance of the scheduler with the given interval. In this example, the scheduler would check every 60 seconds.
const scheduler = new IntervalBasedCronScheduler(60 * 1000)

// Register a new task that will be executed on every future cron date, or only on the next cron date if isOneTimeTask is true.
// An optional errorHandler can be provided, which is called when the task throws an error or returns a promise that gets rejected.
// The task remains scheduled when an error occurs (if not a one time task). Tasks are at max executed only once per interval.
// Returns an id to be used with unregisterTask.
scheduler.registerTask(cron: Cron, task: () => unknown, opts?: { isOneTimeTask?: boolean, errorHandler?: (err: Error) => unknown }): number

// Unregister a task causing it to no longer be executed.
scheduler.unregisterTask(id: number): void

// You can stop the scheduler, which clears the interval.
scheduler.stop()

// You can start the scheduler after stopping it again. A newly created scheduler is started by default.
// Tasks that were due while the scheduler was stopped will be executed on the next interval tick (but only a single time).
scheduler.start()
```

**Pros:**

- Only one interval for all tasks, which is quite performant.

**Cons:**

- Tasks are not executed exactly on the cron date.
- Tasks can only be executed once per interval.

**For most people, the timer based scheduler should be a good option. However, setTimeout can be unreliable for long delays. When you have problems with long timeouts / intervals being skipped, or have performance problems because of many scheduled tasks, you should consider the interval based scheduler.**

## Cron expression format

_cron_schedule_ uses the linux cron syntax as described [here](https://man7.org/linux/man-pages/man5/crontab.5.html) with the addition that you can optionally
specify seconds by prepending the minute field with another field.

```
┌───────────── second (0 - 59, optional)
│ ┌───────────── minute (0 - 59)
│ │ ┌───────────── hour (0 - 23)
│ │ │ ┌───────────── day of month (1 - 31)
│ │ │ │ ┌───────────── month (1 - 12)
│ │ │ │ │ ┌───────────── weekday (0 - 7)
* * * * * *
```

All linux cron features are supported, including

- lists
- ranges
- ranges in lists
- step values
- month names (jan,feb,... - case insensitive)
- weekday names (mon,tue,... - case insensitive)
- time nicknames (@yearly, @annually, @monthly, @weekly, @daily, @hourly - case insensitive)

**For simple timing tasks like every x seconds, you should consider using `setInterval` which is more suitable for simple timing tasks, as it does not have the calculation overhead.**

## Cron validation

Looking for a way to validate cron expressions in your backend (node.js) or in the browser with support for multiple presets? Check out [cron-validate](https://github.com/airfooox/cron-validate)!

Use the `npm-cron-schedule` preset to validate that cron expressions are supported by _cron-schedule_.
