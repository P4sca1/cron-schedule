import type { ITimeZone } from './time-zone.ts'

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

/** A local date and time (as shown by a wall clock), month indexed by 0. */
export interface IWallTime {
	year: number
	month: number
	day: number
	hour: number
	minute: number
	second: number
}

const DAY = 86400000

/** Like Date.UTC, but without mapping the years 0 to 99 to 1900 to 1999. */
export function getUtcTime(wallTime: IWallTime): number {
	if (wallTime.year >= 100) {
		return Date.UTC(
			wallTime.year,
			wallTime.month,
			wallTime.day,
			wallTime.hour,
			wallTime.minute,
			wallTime.second,
		)
	}

	const date = new Date(0)
	date.setUTCFullYear(wallTime.year, wallTime.month, wallTime.day)
	date.setUTCHours(wallTime.hour, wallTime.minute, wallTime.second, 0)
	return date.getTime()
}

/** Gets the wall time of the given instant for the given timezone offset (see ITimeZone#getOffset). */
export function getWallTimeAtOffset(
	instant: number,
	timezoneOffset: number,
): IWallTime {
	const date = new Date(instant - timezoneOffset)

	return {
		year: date.getUTCFullYear(),
		month: date.getUTCMonth(),
		day: date.getUTCDate(),
		hour: date.getUTCHours(),
		minute: date.getUTCMinutes(),
		second: date.getUTCSeconds(),
	}
}

/** Gets the wall time and weekday (0 = Sunday) of the given instant in the given time zone. */
export function getWallTime(
	timeZone: ITimeZone,
	instant: number,
): IWallTime & { weekday: number } {
	const wallTime = getWallTimeAtOffset(instant, timeZone.getOffset(instant))
	return {
		...wallTime,
		weekday: getWeekday(wallTime.year, wallTime.month, wallTime.day),
	}
}

function isSameWallTime(a: IWallTime, b: IWallTime): boolean {
	return (
		a.year === b.year &&
		a.month === b.month &&
		a.day === b.day &&
		a.hour === b.hour &&
		a.minute === b.minute &&
		a.second === b.second
	)
}

/**
 * Gets all instants at which the local time of the given time zone equals the given wall time, in ascending order.
 * Returns no instant, when the wall time is skipped because of a forward time change (e.g. start of daylight
 * saving time) and two instants, when the wall time is repeated because of a backward time change
 * (e.g. end of daylight saving time).
 */
export function getInstantsForWallTime(
	timeZone: ITimeZone,
	wallTime: IWallTime,
): Date[] {
	const wallTimeAsUtc = getUtcTime(wallTime)

	// The offsets one day before and after cover both sides of a time change around the wall time.
	// The offsets at the resulting instants cover offsets that are only valid for a short time.
	const offsets = new Set([
		timeZone.getOffset(wallTimeAsUtc - DAY),
		timeZone.getOffset(wallTimeAsUtc),
		timeZone.getOffset(wallTimeAsUtc + DAY),
	])
	for (const offset of Array.from(offsets)) {
		offsets.add(timeZone.getOffset(wallTimeAsUtc + offset))
	}

	const instants = new Set<number>()
	for (const offset of offsets) {
		const instant = wallTimeAsUtc + offset
		if (
			isSameWallTime(
				getWallTimeAtOffset(instant, timeZone.getOffset(instant)),
				wallTime,
			)
		) {
			instants.add(instant)
		}
	}

	return Array.from(instants)
		.sort((a, b) => a - b)
		.map((instant) => new Date(instant))
}

/**
 * Finds the first instant in (from, to] at which the timezone offset differs from the offset at from.
 * Returns to, when the offsets do not differ.
 */
export function findOffsetTransition(
	timeZone: ITimeZone,
	from: number,
	to: number,
): number {
	const offset = timeZone.getOffset(from)
	if (timeZone.getOffset(to) === offset) {
		return to
	}

	let low = from
	let high = to

	while (high - low > 1) {
		const middle = Math.floor((low + high) / 2)
		if (timeZone.getOffset(middle) === offset) {
			low = middle
		} else {
			high = middle
		}
	}

	return high
}

/**
 * Gets the first instant after the period that contains the given (non-existent) wall time,
 * which is skipped because of a forward time change.
 */
export function getEndOfSkippedPeriod(
	timeZone: ITimeZone,
	wallTime: IWallTime,
): number {
	// Like the Date constructor, interpreting the skipped wall time with the offset before the time change
	// results in an instant after the skipped period.
	const wallTimeAsUtc = getUtcTime(wallTime)
	const afterPeriod = wallTimeAsUtc + timeZone.getOffset(wallTimeAsUtc - DAY)
	return findOffsetTransition(timeZone, afterPeriod - DAY, afterPeriod)
}

/* Gets the amount of days in the given month (indexed by 0) of the given year. */
export function getDaysInMonth(year: number, month: number): number {
	// Calendar arithmetic in UTC, because local days can be skipped entirely by time zone changes.
	const date = new Date(0)
	date.setUTCFullYear(year, month + 1, 0)
	return date.getUTCDate()
}

/* Gets the weekday (0 = Sunday) of the given date. */
export function getWeekday(year: number, month: number, day: number): number {
	// Calendar arithmetic in UTC, because local days can be skipped entirely by time zone changes
	// (e.g. December 30, 2011 in Pacific/Apia).
	const date = new Date(0)
	date.setUTCFullYear(year, month, day)
	return date.getUTCDay()
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
