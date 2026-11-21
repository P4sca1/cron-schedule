/**
 * A zero-dependency cron parser for Node.js, Deno, Bun and the browser.
 *
 * @example
 * ```ts
 * import { parseCronExpression } from '@p4sca1/cron-schedule'
 *
 * const cron = parseCronExpression('0 * * * *')
 * console.log(cron.getNextDate())
 * ```
 *
 * @module
 */

export * from './cron.js'
export * from './cron-parser.js'
