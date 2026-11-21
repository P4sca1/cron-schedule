import {
	extractDateElements,
	findOffsetTransition,
	getDaysBetweenWeekdays,
	getDaysInMonth,
	getEndOfSkippedPeriod,
	getInstantsForWallTime,
	getTimezoneOffsetMs,
	getUtcTime,
	getWallTimeAtOffset,
	getWeekday,
	type IWallTime,
} from './utils.ts'

/** Throws a TypeError for invalid dates (e.g. new Date(NaN)). */
function assertValidDate(date: Date): void {
	if (Number.isNaN(date.getTime())) {
		throw new TypeError('Invalid start date.')
	}
}

/**
 * An object with contains for each element of a date, which values are allowed.
 * Everything starting at 0, except for days.
 */
export interface ICronDefinition {
	readonly seconds: Set<number>
	readonly minutes: Set<number>
	readonly hours: Set<number>
	readonly days: Set<number>
	readonly months: Set<number>
	readonly weekdays: Set<number>
}

export class Cron {
	// Everything starting at 0, except for days.
	public readonly seconds: ReadonlyArray<number>
	public readonly minutes: ReadonlyArray<number>
	public readonly hours: ReadonlyArray<number>
	public readonly days: ReadonlyArray<number>
	public readonly months: ReadonlyArray<number>
	public readonly weekdays: ReadonlyArray<number>

	public readonly reversed: {
		seconds: ReadonlyArray<number>
		minutes: ReadonlyArray<number>
		hours: ReadonlyArray<number>
		days: ReadonlyArray<number>
		months: ReadonlyArray<number>
		weekdays: ReadonlyArray<number>
	}

	public constructor({
		seconds,
		minutes,
		hours,
		days,
		months,
		weekdays,
	}: ICronDefinition) {
		// Validate that there are values provided.
		if (!seconds || seconds.size === 0)
			throw new Error('There must be at least one allowed second.')
		if (!minutes || minutes.size === 0)
			throw new Error('There must be at least one allowed minute.')
		if (!hours || hours.size === 0)
			throw new Error('There must be at least one allowed hour.')
		if (!months || months.size === 0)
			throw new Error('There must be at least one allowed month.')
		if ((!weekdays || weekdays.size === 0) && (!days || days.size === 0))
			throw new Error('There must be at least one allowed day or weekday.')

		// Convert set to array and sort in ascending order.
		this.seconds = Array.from(seconds).sort((a, b) => a - b)
		this.minutes = Array.from(minutes).sort((a, b) => a - b)
		this.hours = Array.from(hours).sort((a, b) => a - b)
		this.days = Array.from(days).sort((a, b) => a - b)
		this.months = Array.from(months).sort((a, b) => a - b)
		this.weekdays = Array.from(weekdays).sort((a, b) => a - b)

		// Validate that all values are integers within the constraint.
		const validateData = (
			name: string,
			data: ReadonlyArray<number>,
			constraint: { min: number; max: number },
		) => {
			if (
				data.some(
					(x) =>
						typeof x !== 'number' ||
						x % 1 !== 0 ||
						x < constraint.min ||
						x > constraint.max,
				)
			) {
				throw new Error(
					`${name} must only consist of integers which are within the range of ${constraint.min} and ${constraint.max}`,
				)
			}
		}

		validateData('seconds', this.seconds, { min: 0, max: 59 })
		validateData('minutes', this.minutes, { min: 0, max: 59 })
		validateData('hours', this.hours, { min: 0, max: 23 })
		validateData('days', this.days, { min: 1, max: 31 })
		validateData('months', this.months, { min: 0, max: 11 })
		validateData('weekdays', this.weekdays, { min: 0, max: 6 })

		// For each element, store a reversed copy in the reversed attribute for finding prev dates.
		this.reversed = {
			seconds: this.seconds.map((x) => x).reverse(),
			minutes: this.minutes.map((x) => x).reverse(),
			hours: this.hours.map((x) => x).reverse(),
			days: this.days.map((x) => x).reverse(),
			months: this.months.map((x) => x).reverse(),
			weekdays: this.weekdays.map((x) => x).reverse(),
		}
	}

	/**
	 * Find the next or previous hour, starting from the given start hour that matches the hour constraint.
	 * startHour itself might also be allowed.
	 */
	private findAllowedHour(
		dir: 'next' | 'prev',
		startHour: number,
	): number | undefined {
		return dir === 'next'
			? this.hours.find((x) => x >= startHour)
			: this.reversed.hours.find((x) => x <= startHour)
	}

	/**
	 * Find the next or previous minute, starting from the given start minute that matches the minute constraint.
	 * startMinute itself might also be allowed.
	 */
	private findAllowedMinute(
		dir: 'next' | 'prev',
		startMinute: number,
	): number | undefined {
		return dir === 'next'
			? this.minutes.find((x) => x >= startMinute)
			: this.reversed.minutes.find((x) => x <= startMinute)
	}

	/**
	 * Find the next or previous second, starting from the given start second that matches the second constraint.
	 * startSecond itself IS NOT allowed.
	 */
	private findAllowedSecond(
		dir: 'next' | 'prev',
		startSecond: number,
	): number | undefined {
		return dir === 'next'
			? this.seconds.find((x) => x > startSecond)
			: this.reversed.seconds.find((x) => x < startSecond)
	}

	/**
	 * Find the next or previous time, starting from the given start time that matches the hour, minute
	 * and second constraints. startTime itself might also be allowed.
	 */
	private findAllowedTime(
		dir: 'next' | 'prev',
		startTime: { hour: number; minute: number; second: number },
	): { hour: number; minute: number; second: number } | undefined {
		// Try to find an allowed hour.
		let hour = this.findAllowedHour(dir, startTime.hour)
		if (hour !== undefined) {
			if (hour === startTime.hour) {
				// We found an hour that is the start hour. Try to find an allowed minute.
				let minute = this.findAllowedMinute(dir, startTime.minute)
				if (minute !== undefined) {
					if (minute === startTime.minute) {
						// We found a minute that is the start minute. Try to find an allowed second.
						const second = this.findAllowedSecond(dir, startTime.second)
						if (second !== undefined) {
							// We found a second within the start hour and minute.
							return { hour, minute, second }
						}
						// We did not find a valid second within the start minute. Try to find another minute.
						minute = this.findAllowedMinute(
							dir,
							dir === 'next' ? startTime.minute + 1 : startTime.minute - 1,
						)
						if (minute !== undefined) {
							// We found a minute which is not the start minute. Return that minute together with the hour and the first / last allowed second.
							return {
								hour,
								minute,
								second:
									dir === 'next' ? this.seconds[0] : this.reversed.seconds[0],
							}
						}
					} else {
						// We found a minute which is not the start minute. Return that minute together with the hour and the first / last allowed second.
						return {
							hour,
							minute,
							second:
								dir === 'next' ? this.seconds[0] : this.reversed.seconds[0],
						}
					}
				}

				// We did not find an allowed minute / second combination inside the start hour. Try to find the next / previous allowed hour.
				hour = this.findAllowedHour(
					dir,
					dir === 'next' ? startTime.hour + 1 : startTime.hour - 1,
				)
				if (hour !== undefined) {
					// We found an allowed hour which is not the start hour. Return that hour together with the first / last allowed minutes / seconds.
					return {
						hour,
						minute: dir === 'next' ? this.minutes[0] : this.reversed.minutes[0],
						second: dir === 'next' ? this.seconds[0] : this.reversed.seconds[0],
					}
				}
			} else {
				// We found an allowed hour which is not the start hour. Return that hour together with the first / last allowed minutes / seconds.
				return {
					hour,
					minute: dir === 'next' ? this.minutes[0] : this.reversed.minutes[0],
					second: dir === 'next' ? this.seconds[0] : this.reversed.seconds[0],
				}
			}
		}

		// No allowed time found.
		return undefined
	}

	/**
	 * Find the next or previous day in the given month, starting from the given startDay
	 * that matches either the day or the weekday constraint. startDay itself might also be allowed.
	 */
	private findAllowedDayInMonth(
		dir: 'next' | 'prev',
		year: number,
		month: number,
		startDay: number,
	): number | undefined {
		if (startDay < 1) throw new Error('startDay must not be smaller than 1.')
		// If only days are restricted: allow day based on day constraint only.
		// If only weekdays are restricted: allow day based on weekday constraint only.
		// If both are restricted: allow day based on both day and weekday constraint. pick day that is closer to startDay.
		// If none are restricted: return the day closest to startDay (respecting dir) that is allowed (or startDay itself).

		const daysInMonth = getDaysInMonth(year, month)
		const daysRestricted = this.days.length !== 31
		const weekdaysRestricted = this.weekdays.length !== 7

		if (!daysRestricted && !weekdaysRestricted) {
			if (startDay > daysInMonth) {
				return dir === 'next' ? undefined : daysInMonth
			}

			return startDay
		}

		// Try to find a day based on the days constraint.
		let allowedDayByDays: number | undefined
		if (daysRestricted) {
			allowedDayByDays =
				dir === 'next'
					? this.days.find((x) => x >= startDay)
					: this.reversed.days.find((x) => x <= startDay)

			// Make sure the day does not exceed the amount of days in month.
			if (allowedDayByDays !== undefined && allowedDayByDays > daysInMonth) {
				allowedDayByDays = undefined
			}
		}

		// Try to find a day based on the weekday constraint.
		let allowedDayByWeekdays: number | undefined
		if (weekdaysRestricted) {
			const startWeekday = getWeekday(year, month, startDay)
			const nearestAllowedWeekday =
				dir === 'next'
					? (this.weekdays.find((x) => x >= startWeekday) ?? this.weekdays[0])
					: (this.reversed.weekdays.find((x) => x <= startWeekday) ??
						this.reversed.weekdays[0])

			if (nearestAllowedWeekday !== undefined) {
				const daysBetweenWeekdays =
					dir === 'next'
						? getDaysBetweenWeekdays(startWeekday, nearestAllowedWeekday)
						: getDaysBetweenWeekdays(nearestAllowedWeekday, startWeekday)

				allowedDayByWeekdays =
					dir === 'next'
						? startDay + daysBetweenWeekdays
						: startDay - daysBetweenWeekdays

				// Make sure the day does not exceed the month boundaries.
				if (allowedDayByWeekdays > daysInMonth || allowedDayByWeekdays < 1) {
					allowedDayByWeekdays = undefined
				}
			}
		}

		if (allowedDayByDays !== undefined && allowedDayByWeekdays !== undefined) {
			// If a day is found both via the days and the weekdays constraint, pick the day
			// that is closer to start date.
			return dir === 'next'
				? Math.min(allowedDayByDays, allowedDayByWeekdays)
				: Math.max(allowedDayByDays, allowedDayByWeekdays)
		}

		if (allowedDayByDays !== undefined) {
			return allowedDayByDays
		}

		if (allowedDayByWeekdays !== undefined) {
			return allowedDayByWeekdays
		}

		return undefined
	}

	/**
	 * Returns true when the cron matches every hour of the day.
	 * Like cron(8), such jobs run in every real hour during daylight saving time changes,
	 * while jobs that run at specific hours run only once in a repeated hour.
	 */
	private matchesEveryHour(): boolean {
		return this.hours.length === 24
	}

	/**
	 * Returns the earliest instant after startDate that falls into the repeated period of a backward time change
	 * (e.g. the end of daylight saving time) and matches the cron, when startDate itself lies in the first
	 * occurrence of a repeated local time. Wall-clock based search skips this period, because the local time
	 * jumps backwards.
	 */
	private findNextDateInRepeatedPeriod(startDate: Date): Date | undefined {
		const occurrences = getInstantsForWallTime(extractDateElements(startDate))
		// startDate must lie in the first occurrence, i.e. before the time change.
		if (
			occurrences.length < 2 ||
			startDate.getTime() >= occurrences[occurrences.length - 1].getTime()
		) {
			return undefined
		}

		// The time change happens between the first and the second occurrence of the start wall time.
		const transition = findOffsetTransition(
			startDate.getTime(),
			occurrences[occurrences.length - 1].getTime(),
		)
		const offsetAfter = getTimezoneOffsetMs(transition)
		const wallTime = this.findWallTime(
			'next',
			getWallTimeAtOffset(transition - 1000, offsetAfter),
		)

		return getInstantsForWallTime(wallTime).find(
			(date) => date.getTime() >= transition,
		)
	}

	/**
	 * Returns the latest instant before startDate that falls into the first occurrence of a period, which
	 * is repeated because of a backward time change, and matches the cron, when startDate itself lies in the
	 * second occurrence of a repeated local time.
	 */
	private findPrevDateInRepeatedPeriod(startDate: Date): Date | undefined {
		const occurrences = getInstantsForWallTime(extractDateElements(startDate))
		// startDate must lie in the second occurrence, i.e. after the time change.
		if (
			occurrences.length < 2 ||
			startDate.getTime() < occurrences[occurrences.length - 1].getTime()
		) {
			return undefined
		}

		const transition = findOffsetTransition(
			occurrences[0].getTime(),
			startDate.getTime(),
		)
		const offsetBefore = getTimezoneOffsetMs(transition - 1)
		const wallTime = this.findWallTime(
			'prev',
			getWallTimeAtOffset(transition, offsetBefore),
		)

		return getInstantsForWallTime(wallTime)
			.reverse()
			.find((date) => date.getTime() < transition)
	}

	/** Gets the next date starting from the given start date or now. */
	public getNextDate(startDate: Date = new Date()): Date {
		assertValidDate(startDate)
		let wallTime: IWallTime = extractDateElements(startDate)

		while (true) {
			wallTime = this.findWallTime('next', wallTime)
			// The wall time is outside of the range of JavaScript dates.
			if (!Number.isFinite(getUtcTime(wallTime))) {
				throw new Error('No valid next date was found.')
			}

			const instants = getInstantsForWallTime(wallTime)

			let nextDate: Date | undefined
			if (instants.length === 0) {
				// The wall time does not exist, because the clock was turned forward (e.g. start of daylight saving time).
				// Like cron(8), jobs that run at specific hours run once right after the skipped period,
				// while jobs that run every hour are scheduled normally and skip the period.
				const periodEnd = getEndOfSkippedPeriod(wallTime)
				if (!this.matchesEveryHour() && periodEnd > startDate.getTime()) {
					nextDate = new Date(periodEnd)
				} else {
					// Continue searching after the skipped period (and never go backwards).
					const wallTimeAfterPeriod = getWallTimeAtOffset(
						periodEnd - 1000,
						getTimezoneOffsetMs(periodEnd),
					)
					if (getUtcTime(wallTimeAfterPeriod) > getUtcTime(wallTime)) {
						wallTime = wallTimeAfterPeriod
					}
					continue
				}
			} else {
				// The wall time may exist twice, because the clock was turned backward (e.g. end of daylight saving time).
				// Jobs that run at specific hours only run on the first occurrence.
				nextDate = (this.matchesEveryHour() ? instants : [instants[0]]).find(
					(date) => date.getTime() > startDate.getTime(),
				)
			}

			if (nextDate === undefined) {
				continue
			}

			if (this.matchesEveryHour()) {
				const repeatedDate = this.findNextDateInRepeatedPeriod(startDate)
				if (
					repeatedDate !== undefined &&
					repeatedDate.getTime() > startDate.getTime() &&
					repeatedDate.getTime() < nextDate.getTime()
				) {
					return repeatedDate
				}
			}

			return nextDate
		}
	}

	/**
	 * Finds the next or previous wall time (local date and time) that matches the cron, starting from the given
	 * wall time. The start wall time itself is not allowed.
	 */
	private findWallTime(dir: 'next' | 'prev', start: IWallTime): IWallTime {
		return dir === 'next'
			? this.findNextWallTime(start)
			: this.findPrevWallTime(start)
	}

	private findNextWallTime(startDateElements: IWallTime): IWallTime {
		let minYear = startDateElements.year

		let startIndexMonth = this.months.findIndex(
			(x) => x >= startDateElements.month,
		)
		if (startIndexMonth === -1) {
			startIndexMonth = 0
			minYear++
		}

		// We try every month within the next 5 years to make sure that we tried to
		// find a matching date insidde a whole leap year.
		const maxIterations = this.months.length * 5

		for (let i = 0; i < maxIterations; i++) {
			// Get the next year and month.
			const year =
				minYear + Math.floor((startIndexMonth + i) / this.months.length)
			const month = this.months[(startIndexMonth + i) % this.months.length]
			const isStartMonth =
				year === startDateElements.year && month === startDateElements.month

			// Find the next day.
			let day = this.findAllowedDayInMonth(
				'next',
				year,
				month,
				isStartMonth ? startDateElements.day : 1,
			)
			let isStartDay = isStartMonth && day === startDateElements.day

			// If we found a day and it is the start day, try to find a valid time beginning from the start date time.
			if (day !== undefined && isStartDay) {
				const nextTime = this.findAllowedTime('next', startDateElements)
				if (nextTime !== undefined) {
					return { year, month, day, ...nextTime }
				}

				// If no valid time has been found for the start date, try the next day.
				day = this.findAllowedDayInMonth('next', year, month, day + 1)
				isStartDay = false
			}

			// If we found a next day and it is not the start day, just use the next day with the first allowed values
			// for hours, minutes and seconds.
			if (day !== undefined && !isStartDay) {
				return {
					year,
					month,
					day,
					hour: this.hours[0],
					minute: this.minutes[0],
					second: this.seconds[0],
				}
			}

			// No allowed day has been found for this month. Continue to search in next month.
		}

		throw new Error('No valid next date was found.')
	}

	/** Gets the specified amount of future dates starting from the given start date or now. */
	public getNextDates(amount: number, startDate?: Date): Date[] {
		const dates = []
		let nextDate: Date | undefined

		for (let i = 0; i < amount; i++) {
			nextDate = this.getNextDate(nextDate ?? startDate)
			dates.push(nextDate)
		}

		return dates
	}

	/**
	 * Get an ES6 compatible iterator which iterates over the next dates starting from startDate or now.
	 * The iterator runs until the optional endDate is reached or forever.
	 */
	public *getNextDatesIterator(
		startDate?: Date,
		endDate?: Date,
	): Generator<Date, undefined, undefined> {
		let nextDate: Date | undefined

		while (true) {
			nextDate = this.getNextDate(nextDate ?? startDate)

			if (endDate && endDate.getTime() < nextDate.getTime()) {
				return
			}

			yield nextDate
		}
	}

	/** Gets the previous date before the given start date or now. */
	public getPrevDate(startDate: Date = new Date()): Date {
		assertValidDate(startDate)

		// When startDate has milliseconds, the beginning of its second is before startDate.
		// The search below only considers earlier seconds, so check this second first.
		const startSecond =
			startDate.getTime() - (((startDate.getTime() % 1000) + 1000) % 1000)
		if (
			startSecond < startDate.getTime() &&
			this.isOccurrence(new Date(startSecond))
		) {
			return new Date(startSecond)
		}

		let wallTime: IWallTime = extractDateElements(startDate)

		while (true) {
			wallTime = this.findWallTime('prev', wallTime)
			// The wall time is outside of the range of JavaScript dates.
			if (!Number.isFinite(getUtcTime(wallTime))) {
				throw new Error('No valid previous date was found.')
			}

			const instants = getInstantsForWallTime(wallTime)

			let prevDate: Date | undefined
			if (instants.length === 0) {
				// The wall time does not exist (see getNextDate).
				const periodEnd = getEndOfSkippedPeriod(wallTime)
				if (!this.matchesEveryHour() && periodEnd < startDate.getTime()) {
					prevDate = new Date(periodEnd)
				} else {
					// Continue searching before the skipped period (and never go forwards).
					const wallTimeBeforePeriod = getWallTimeAtOffset(
						periodEnd,
						getTimezoneOffsetMs(periodEnd - 1),
					)
					if (getUtcTime(wallTimeBeforePeriod) < getUtcTime(wallTime)) {
						wallTime = wallTimeBeforePeriod
					}
					continue
				}
			} else {
				prevDate = (this.matchesEveryHour() ? instants : [instants[0]])
					.reverse()
					.find((date) => date.getTime() < startDate.getTime())
			}

			// All occurrences of the wall time are at or after startDate. Continue searching from the wall time.
			if (prevDate === undefined) {
				continue
			}

			// Unlike in getNextDate, this also applies to jobs that run at specific hours: Their first occurrence in
			// the repeated period is before startDate, but its wall time is after the wall time of startDate.
			const repeatedDate = this.findPrevDateInRepeatedPeriod(startDate)
			if (
				repeatedDate !== undefined &&
				repeatedDate.getTime() < startDate.getTime() &&
				repeatedDate.getTime() > prevDate.getTime()
			) {
				return repeatedDate
			}

			return prevDate
		}
	}

	private findPrevWallTime(startDateElements: IWallTime): IWallTime {
		let maxYear = startDateElements.year

		let startIndexMonth = this.reversed.months.findIndex(
			(x) => x <= startDateElements.month,
		)
		if (startIndexMonth === -1) {
			startIndexMonth = 0
			maxYear--
		}

		// We try every month within the past 5 years to make sure that we tried to
		// find a matching date inside a whole leap year.
		const maxIterations = this.reversed.months.length * 5

		for (let i = 0; i < maxIterations; i++) {
			// Get the next year and month.
			const year =
				maxYear -
				Math.floor((startIndexMonth + i) / this.reversed.months.length)
			const month =
				this.reversed.months[
					(startIndexMonth + i) % this.reversed.months.length
				]
			const isStartMonth =
				year === startDateElements.year && month === startDateElements.month

			// Find the previous day.
			let day = this.findAllowedDayInMonth(
				'prev',
				year,
				month,
				isStartMonth
					? startDateElements.day
					: // Start searching from the last day of the month.
						getDaysInMonth(year, month),
			)
			let isStartDay = isStartMonth && day === startDateElements.day

			// If we found a day and it is the start day, try to find a valid time beginning from the start date time.
			if (day !== undefined && isStartDay) {
				const prevTime = this.findAllowedTime('prev', startDateElements)
				if (prevTime !== undefined) {
					return { year, month, day, ...prevTime }
				}

				// If no valid time has been found for the start date, try the previous day.
				if (day > 1) {
					day = this.findAllowedDayInMonth('prev', year, month, day - 1)
					isStartDay = false
				}
			}

			// If we found a previous day and it is not the start day, just use the previous day with the first allowed values
			// for hours, minutes and seconds (which will be the latest time due to using the reversed array).
			if (day !== undefined && !isStartDay) {
				return {
					year,
					month,
					day,
					hour: this.reversed.hours[0],
					minute: this.reversed.minutes[0],
					second: this.reversed.seconds[0],
				}
			}

			// No allowed day has been found for this month. Continue to search in previous month.
		}

		throw new Error('No valid previous date was found.')
	}

	/** Gets the specified amount of previous dates starting from the given start date or now. */
	public getPrevDates(amount: number, startDate?: Date): Date[] {
		const dates = []
		let prevDate: Date | undefined

		for (let i = 0; i < amount; i++) {
			prevDate = this.getPrevDate(prevDate ?? startDate)
			dates.push(prevDate)
		}

		return dates
	}

	/**
	 * Get an ES6 compatible iterator which iterates over the previous dates starting from startDate or now.
	 * The iterator runs until the optional endDate is reached or forever.
	 */
	public *getPrevDatesIterator(
		startDate?: Date,
		endDate?: Date,
	): Generator<Date, undefined, undefined> {
		let prevDate: Date | undefined

		while (true) {
			prevDate = this.getPrevDate(prevDate ?? startDate)

			if (endDate && endDate.getTime() > prevDate.getTime()) {
				return
			}

			yield prevDate
		}
	}

	/**
	 * Returns true when the given date (without milliseconds) is a cron date, taking time changes into account:
	 * Jobs that run at specific hours only run on the first occurrence of a repeated wall time.
	 */
	private isOccurrence(date: Date): boolean {
		if (!this.matchDate(date)) {
			return false
		}

		if (this.matchesEveryHour()) {
			return true
		}

		const [firstOccurrence] = getInstantsForWallTime(extractDateElements(date))
		return firstOccurrence?.getTime() === date.getTime()
	}

	/** Returns true when there is a cron date at the given date. */
	public matchDate(date: Date): boolean {
		const { second, minute, hour, day, month, weekday } =
			extractDateElements(date)

		if (
			this.seconds.indexOf(second) === -1 ||
			this.minutes.indexOf(minute) === -1 ||
			this.hours.indexOf(hour) === -1 ||
			this.months.indexOf(month) === -1
		) {
			return false
		}

		if (this.days.length !== 31 && this.weekdays.length !== 7) {
			return (
				this.days.indexOf(day) !== -1 || this.weekdays.indexOf(weekday) !== -1
			)
		}

		return (
			this.days.indexOf(day) !== -1 && this.weekdays.indexOf(weekday) !== -1
		)
	}
}
