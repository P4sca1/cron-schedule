import { getUtcTime } from './utils.ts'

/**
 * A time zone, described by its offset from UTC at any instant.
 * All other calculations (wall times, skipped and repeated periods of time changes) are derived from it.
 */
export interface ITimeZone {
	/**
	 * Gets the offset of the time zone at the given instant (milliseconds since the epoch) in milliseconds,
	 * with the same sign as Date#getTimezoneOffset (positive west of UTC).
	 */
	getOffset(instant: number): number
}

/** Gets the milliseconds of the given instant, also for instants before the epoch. */
function getMilliseconds(instant: number): number {
	return ((instant % 1000) + 1000) % 1000
}

/**
 * The local time zone of the runtime (as used by the Date methods).
 * Unlike Date#getTimezoneOffset, it keeps the seconds of historical offsets (e.g. local mean time before 1883).
 */
export const localTimeZone: ITimeZone = {
	getOffset(instant: number): number {
		const date = new Date(instant)
		const localTimeAsUtc = getUtcTime({
			year: date.getFullYear(),
			month: date.getMonth(),
			day: date.getDate(),
			hour: date.getHours(),
			minute: date.getMinutes(),
			second: date.getSeconds(),
		})

		return instant - localTimeAsUtc - date.getMilliseconds()
	},
}

/** Creates a time zone for an IANA time zone name (e.g. Europe/Berlin), based on Intl.DateTimeFormat. */
function createIanaTimeZone(name: string): ITimeZone {
	// Throws a RangeError for invalid time zone names.
	const format = new Intl.DateTimeFormat('en-US', {
		timeZone: name,
		hourCycle: 'h23',
		era: 'short',
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
	})

	// Calculating dates queries the offsets of the same instants repeatedly, while Intl.DateTimeFormat is slow.
	// The cache only stores exact instants, so it never returns a wrong offset.
	const cache = new Map<number, number>()

	return {
		getOffset(instant: number): number {
			const cachedOffset = cache.get(instant)
			if (cachedOffset !== undefined) {
				return cachedOffset
			}

			const offset = computeOffset(instant)
			if (cache.size >= 1000) {
				cache.clear()
			}
			cache.set(instant, offset)
			return offset
		},
	}

	function computeOffset(instant: number): number {
		// Like the local time zone, instants outside of the range of JavaScript dates have no offset.
		const date = new Date(instant)
		if (Number.isNaN(date.getTime())) {
			return Number.NaN
		}

		const parts: Record<string, string> = {}
		for (const { type, value } of format.formatToParts(date)) {
			parts[type] = value
		}

		// Years before 1 AD are formatted as positive years with the era BC (1 BC is the year 0).
		const year = Number(parts.year)
		const localTimeAsUtc = getUtcTime({
			year: parts.era === 'BC' ? 1 - year : year,
			month: Number(parts.month) - 1,
			day: Number(parts.day),
			hour: Number(parts.hour),
			minute: Number(parts.minute),
			second: Number(parts.second),
		})

		return instant - localTimeAsUtc - getMilliseconds(instant)
	}
}

const ianaTimeZones = new Map<string, ITimeZone>()

/**
 * Gets the time zone for the given IANA time zone name (e.g. Europe/Berlin) or the local time zone of the runtime,
 * when no name is given. Throws a RangeError for invalid time zone names.
 */
export function getTimeZone(name?: string): ITimeZone {
	if (name === undefined) {
		return localTimeZone
	}

	let timeZone = ianaTimeZones.get(name)
	if (timeZone === undefined) {
		timeZone = createIanaTimeZone(name)
		ianaTimeZones.set(name, timeZone)
	}

	return timeZone
}
