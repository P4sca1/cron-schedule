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

/**
 * Creates a local date with the given year, month and day at noon.
 * Unlike the Date constructor, the years 0 to 99 are not mapped to 1900 to 1999.
 * Noon avoids that a time change around midnight moves the date to another day.
 */
function createLocalDay(year: number, month: number, day: number): Date {
	const date = new Date(2000, 0, 1, 12)
	date.setFullYear(year, month, day)
	return date
}

/**
 * Creates a date from the given wall time like the Date constructor, but without mapping the years 0 to 99
 * to 1900 to 1999.
 * Wall times that do not exist because of a forward time change are shifted forward by the length of the change.
 * Wall times that exist twice because of a backward time change resolve to the first occurrence.
 */
export function createDate(wallTime: IWallTime): Date {
	const date = createLocalDay(wallTime.year, wallTime.month, wallTime.day)
	date.setHours(wallTime.hour, wallTime.minute, wallTime.second, 0)
	return date
}

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

/**
 * Gets the timezone offset of the given instant in milliseconds, with the same sign as getTimezoneOffset.
 * Unlike getTimezoneOffset, it keeps the seconds of historical offsets (e.g. local mean time before 1883).
 */
export function getTimezoneOffsetMs(instant: number): number {
	const date = new Date(instant)
	const year = date.getFullYear()
	if (year >= 100) {
		return (
			instant -
			Date.UTC(
				year,
				date.getMonth(),
				date.getDate(),
				date.getHours(),
				date.getMinutes(),
				date.getSeconds(),
				date.getMilliseconds(),
			)
		)
	}

	// Date.UTC maps the years 0 to 99 to 1900 to 1999.
	const localTimeAsUtc = new Date(0)
	localTimeAsUtc.setUTCFullYear(year, date.getMonth(), date.getDate())
	localTimeAsUtc.setUTCHours(
		date.getHours(),
		date.getMinutes(),
		date.getSeconds(),
		date.getMilliseconds(),
	)
	return instant - localTimeAsUtc.getTime()
}

function isSameWallTime(date: Date, wallTime: IWallTime): boolean {
	return (
		date.getFullYear() === wallTime.year &&
		date.getMonth() === wallTime.month &&
		date.getDate() === wallTime.day &&
		date.getHours() === wallTime.hour &&
		date.getMinutes() === wallTime.minute &&
		date.getSeconds() === wallTime.second
	)
}

/**
 * Gets all instants at which the local time equals the given wall time, in ascending order.
 * Returns no instant, when the wall time is skipped because of a forward time change (e.g. start of daylight
 * saving time) and two instants, when the wall time is repeated because of a backward time change
 * (e.g. end of daylight saving time).
 */
export function getInstantsForWallTime(wallTime: IWallTime): Date[] {
	const createdDate = createDate(wallTime)
	const wallTimeAsUtc = getUtcTime(wallTime)
	const instants = new Set<number>()

	if (isSameWallTime(createdDate, wallTime)) {
		instants.add(createdDate.getTime())
	}

	// The offsets one day before and after cover both sides of a time change around the wall time.
	const offsets = new Set([
		getTimezoneOffsetMs(wallTimeAsUtc - 86400000),
		getTimezoneOffsetMs(createdDate.getTime()),
		getTimezoneOffsetMs(wallTimeAsUtc + 86400000),
	])

	for (const offset of offsets) {
		const instant = new Date(wallTimeAsUtc + offset)
		if (isSameWallTime(instant, wallTime)) {
			instants.add(instant.getTime())
		}
	}

	return Array.from(instants)
		.sort((a, b) => a - b)
		.map((instant) => new Date(instant))
}

/**
 * Gets the first instant after the period that contains the given (non-existent) wall time,
 * which is skipped because of a forward time change.
 */
export function getEndOfSkippedPeriod(wallTime: IWallTime): number {
	// The Date constructor resolves a skipped wall time to an instant after the skipped period.
	const afterPeriod = createDate(wallTime).getTime()
	return findOffsetTransition(afterPeriod - 86400000, afterPeriod)
}

/** Gets the wall time of the given instant for the given timezone offset (see getTimezoneOffsetMs). */
export function getWallTimeAtOffset(
	instant: number,
	timezoneOffsetMs: number,
): IWallTime {
	const date = new Date(instant - timezoneOffsetMs)

	return {
		year: date.getUTCFullYear(),
		month: date.getUTCMonth(),
		day: date.getUTCDate(),
		hour: date.getUTCHours(),
		minute: date.getUTCMinutes(),
		second: date.getUTCSeconds(),
	}
}

/**
 * Finds the first instant in (from, to] at which the timezone offset differs from the offset at from.
 * Returns to, when the offsets do not differ.
 */
export function findOffsetTransition(from: number, to: number): number {
	const offset = getTimezoneOffsetMs(from)
	if (getTimezoneOffsetMs(to) === offset) {
		return to
	}

	let low = from
	let high = to

	while (high - low > 1) {
		const middle = Math.floor((low + high) / 2)
		if (getTimezoneOffsetMs(middle) === offset) {
			low = middle
		} else {
			high = middle
		}
	}

	return high
}

/* Gets the amount of days in the given month (indexed by 0) of the given year. */
export function getDaysInMonth(year: number, month: number): number {
	return createLocalDay(year, month + 1, 0).getDate()
}

/* Gets the weekday (0 = Sunday) of the given date. */
export function getWeekday(year: number, month: number, day: number): number {
	return createLocalDay(year, month, day).getDay()
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
