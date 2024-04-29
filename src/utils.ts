export const TIMEOUT_MAX = 2147483647 // 2^31-1

export interface ITimerHandle {
	timeoutId?: ReturnType<typeof setTimeout>
}

/**
 * Creates a new timeout, which can exceed the max timeout limit of 2^31-1.
 * Since multiple timeouts are used internally, the timeoutId used to clear the timeout
 * is returned as a handle (object) and changes whenever the max timeout limit is exceeded.
 * The handle parameter can be ignored, it is used internally for updating the timeoutId
 * in the handle after creating the next timeout.
 */
export function longTimeout(
	fn: () => void,
	timeout: number,
	previousHandle?: ITimerHandle,
): ITimerHandle {
	let nextTimeout = timeout
	let remainingTimeout = 0

	if (nextTimeout > TIMEOUT_MAX) {
		remainingTimeout = nextTimeout - TIMEOUT_MAX
		nextTimeout = TIMEOUT_MAX
	}

	const handle = previousHandle ?? {
		timeoutId: undefined,
	}

	handle.timeoutId = setTimeout(() => {
		if (remainingTimeout > 0) {
			longTimeout(fn, remainingTimeout, previousHandle)
		} else {
			fn()
		}
	}, nextTimeout)

	return handle
}

/* Extracts second, minute, hour, date, month and the weekday from a date. */
export function extractDateElements(date: Date): {
	second: number
	minute: number
	hour: number
	day: number
	month: number
	weekday: number
	year: number
} {
	return {
		second: date.getSeconds(),
		minute: date.getMinutes(),
		hour: date.getHours(),
		day: date.getDate(),
		month: date.getMonth(),
		weekday: date.getDay(),
		year: date.getFullYear(),
	}
}

/* Gets the amount of days in the given month (indexed by 0) of the given year. */
export function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month + 1, 0).getDate()
}

/* Gets the amount of days from weekday1 to weekday2. */
export function getDaysBetweenWeekdays(
	weekday1: number,
	weekday2: number,
): number {
	if (weekday1 <= weekday2) {
		return weekday2 - weekday1
	}

	return 6 - weekday1 + weekday2 + 1
}

export function wrapFunction(
	fn: () => unknown,
	errorHandler?: (err: unknown) => unknown,
) {
	return () => {
		try {
			const res = fn()

			if (res instanceof Promise) {
				res.catch((err) => {
					if (errorHandler) {
						errorHandler(err)
					}
				})
			}
		} catch (err) {
			if (errorHandler) {
				errorHandler(err)
			}
		}
	}
}
