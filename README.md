# cron-schedule
A zero-dependency cron scheduler for Node.js and the browser.

## Features
* Parse cron expressions.
* Get next or previous schedules from a specific starting date.
* Check if a date matches a cron expression.
* Schedule a function call based on a cron expression.
* Fully tree-shakeable API.
* Timezone support.

## Installation for usage in Node.js or in the browser via bundlers
Via npm:

`$ npm install cron-schedule`

Via yarn:

`$ yarn add cron-schedule`

**Requires at least Node.js 10.13.0**

## Installation for usage in the browser without a bundler
`<script src="https://unpkg.com/cron-schedule@:version"></script>`

Replace `:version` with the desired version. Semver ranges are supported. To always use the latest `1.x` version use `^1.0.0`.
See [Releases](https://github.com/P4sca1/cron-schedule/releases) for a list of available versions.

After the script has been loaded, you can use the global `cronSchedule` object to access the API.

**Requires ES6 (ES2015) browser support. Internet Explorer is not supported.** If you need to support older browsers, get _cron-schedula_ via npm or yarn and transpile it with your bundler.

## API
WORK IN PROGRESS