/**
 * A cron scheduler that creates one timer for every scheduled cron.
 *
 * @example
 * ```ts
 * import { parseCronExpression } from '@p4sca1/cron-schedule'
 * import { TimerBasedCronScheduler } from '@p4sca1/cron-schedule/schedulers/timer-based'
 *
 * TimerBasedCronScheduler.setInterval(parseCronExpression('0 * * * *'), () => console.log('Task executed'))
 * ```
 *
 * @module
 */

import type { Cron } from '../cron.ts'
import { type ITimerHandle, longTimeout, wrapFunction } from '../utils.ts'

/**
 * A cron scheduler that is based on timers.
 * It will create one timer for every scheduled cron.
 * When the node timeout limit of ~24 days would be exceeded,
 * it uses multiple consecutive timeouts.
 */

// biome-ignore lint/complexity/noStaticOnlyClass: a static class makes sense here to encapsulate the functionality
export class TimerBasedCronScheduler {
	/**
	 * Creates a timeout, which will fire the given task on the next cron date.
	 * Returns a handle which can be used to clear the timeout using clearTimeoutOrInterval.
	 */
	public static setTimeout(
		cron: Cron,
		task: () => unknown,
		opts?: { errorHandler?: (err: unknown) => unknown },
	): ITimerHandle {
		const nextSchedule = cron.getNextDate()
		const timeout = nextSchedule.getTime() - Date.now()

		return longTimeout(wrapFunction(task, opts?.errorHandler), timeout)
	}

	/**
	 * Creates an interval, which will fire the given task on every future cron date.
	 * Returns a handle which can be used to clear the interval using clearTimeoutOrInterval.
	 */
	public static setInterval(
		cron: Cron,
		task: () => unknown,
		opts?: { errorHandler?: (err: unknown) => unknown; handle?: ITimerHandle },
	): ITimerHandle {
		const handle = opts?.handle ?? { timeoutId: undefined }
		const timeout = cron.getNextDate().getTime() - Date.now()

		// The handle is passed on, so that it always holds the current timeout, also when
		// multiple consecutive timeouts are needed for dates beyond the timeout limit.
		return longTimeout(
			() => {
				// Schedule the next execution first, so that the task itself can clear the interval.
				TimerBasedCronScheduler.setInterval(cron, task, { ...opts, handle })
				wrapFunction(task, opts?.errorHandler)()
			},
			timeout,
			handle,
		)
	}

	/** Clears a timeout or interval, making sure that the function will no longer execute. */
	public static clearTimeoutOrInterval(handle: ITimerHandle): void {
		if (handle.timeoutId) {
			clearTimeout(handle.timeoutId)
		}
	}
}
