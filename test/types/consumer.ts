// Type checks the built package (dist) like a consumer does. Run "pnpm build" first.
// The package imports itself by its name, which is resolved via the "exports" field of package.json.
import { type Cron, parseCronExpression } from 'cron-schedule'
import { IntervalBasedCronScheduler } from 'cron-schedule/schedulers/interval-based.js'
import { TimerBasedCronScheduler } from 'cron-schedule/schedulers/timer-based.js'

const cron: Cron = parseCronExpression('0 * * * *')
const berlin: Cron = parseCronExpression('0 9 * * *', {
	timezone: 'Europe/Berlin',
})
const timezone: string | undefined = berlin.timezone
const nextDate: Date = cron.getNextDate()
const handle = TimerBasedCronScheduler.setTimeout(cron, () => {})
TimerBasedCronScheduler.clearTimeoutOrInterval(handle)
new IntervalBasedCronScheduler(1000).registerTask(cron, () => {})

// @ts-expect-error -- proves that the types are resolved and not any.
const invalid: string = cron.getNextDate()

export { invalid, nextDate, timezone }
