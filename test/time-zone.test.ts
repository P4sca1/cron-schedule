import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { Cron, parseCronExpression } from '../src/index.ts'

const originalTimeZone = process.env.TZ

// The local time zone differs from all time zones used in the tests, which proves that it is not used.
beforeAll(() => {
	process.env.TZ = 'Asia/Tokyo'
})
afterAll(() => {
	process.env.TZ = originalTimeZone
})

const iso = (dates: Date[]) => dates.map((date) => date.toISOString())

describe('timezone option', () => {
	test('evaluates the cron expression in the given time zone', () => {
		const cron = parseCronExpression('0 9 * * *', {
			timezone: 'Europe/Berlin',
		})
		expect(cron.timezone).toBe('Europe/Berlin')

		// 09:00 CEST (UTC+2) in summer and 09:00 CET (UTC+1) in winter.
		expect(
			cron.getNextDate(new Date('2024-07-01T00:00:00Z')).toISOString(),
		).toBe('2024-07-01T07:00:00.000Z')
		expect(
			cron.getNextDate(new Date('2024-12-01T00:00:00Z')).toISOString(),
		).toBe('2024-12-01T08:00:00.000Z')
		expect(
			cron.getPrevDate(new Date('2024-12-01T00:00:00Z')).toISOString(),
		).toBe('2024-11-30T08:00:00.000Z')
	})

	test('supports offsets that are not whole hours', () => {
		// Asia/Kolkata is UTC+05:30, Pacific/Chatham is UTC+12:45 in winter (southern hemisphere: July).
		expect(
			parseCronExpression('0 0 * * *', { timezone: 'Asia/Kolkata' })
				.getNextDate(new Date('2024-07-01T00:00:00Z'))
				.toISOString(),
		).toBe('2024-07-01T18:30:00.000Z')
		expect(
			parseCronExpression('0 0 * * *', { timezone: 'Pacific/Chatham' })
				.getNextDate(new Date('2024-07-01T00:00:00Z'))
				.toISOString(),
		).toBe('2024-07-01T11:15:00.000Z')
	})

	test('uses the weekday and date of the given time zone', () => {
		// Monday 00:00 in Tokyo (UTC+9) is Sunday 15:00 UTC.
		const monday = parseCronExpression('0 0 * * 1', {
			timezone: 'Asia/Tokyo',
		})
		expect(
			monday.getNextDate(new Date('2024-07-03T00:00:00Z')).toISOString(),
		).toBe('2024-07-07T15:00:00.000Z')

		// The first day of the month in Los Angeles (UTC-7 in summer).
		const firstDay = parseCronExpression('0 0 1 * *', {
			timezone: 'America/Los_Angeles',
		})
		expect(
			firstDay.getNextDate(new Date('2024-07-15T00:00:00Z')).toISOString(),
		).toBe('2024-08-01T07:00:00.000Z')
	})

	test('matchDate uses the given time zone', () => {
		const cron = parseCronExpression('30 8 * * *', {
			timezone: 'America/New_York',
		})
		expect(cron.matchDate(new Date('2024-07-01T12:30:00Z'))).toBe(true)
		expect(cron.matchDate(new Date('2024-07-01T08:30:00Z'))).toBe(false)
	})

	test('handles daylight saving time changes of the given time zone', () => {
		// America/New_York: 2024-03-10 02:00 EST -> 03:00 EDT and 2024-11-03 02:00 EDT -> 01:00 EST.
		const skipped = parseCronExpression('30 2 * * *', {
			timezone: 'America/New_York',
		})
		expect(
			iso(skipped.getPrevDates(3, new Date('2024-03-11T12:00:00-04:00'))),
		).toEqual([
			'2024-03-11T06:30:00.000Z',
			'2024-03-10T07:00:00.000Z', // 03:00 EDT, right after the skipped hour
			'2024-03-09T07:30:00.000Z',
		])

		const hourly = parseCronExpression('0 * * * *', {
			timezone: 'America/New_York',
		})
		expect(
			iso(hourly.getNextDates(3, new Date('2024-11-03T00:30:00-04:00'))),
		).toEqual([
			'2024-11-03T05:00:00.000Z', // 01:00 EDT
			'2024-11-03T06:00:00.000Z', // 01:00 EST
			'2024-11-03T07:00:00.000Z',
		])
	})

	test('throws when no date is found within the range of JavaScript dates', () => {
		const cron = parseCronExpression('* * * * * *', {
			timezone: 'America/New_York',
		})
		expect(() => cron.getNextDate(new Date(8640000000000000))).toThrow(
			'No valid next date was found.',
		)
		expect(() => cron.getPrevDate(new Date(-8640000000000000))).toThrow(
			'No valid previous date was found.',
		)
	})

	test('throws for invalid time zones', () => {
		expect(() =>
			parseCronExpression('* * * * *', { timezone: 'Invalid/Zone' }),
		).toThrow(RangeError)
	})

	test('can be passed to the Cron constructor', () => {
		const cron = new Cron(
			{
				seconds: new Set([0]),
				minutes: new Set([0]),
				hours: new Set([12]),
				days: new Set(Array.from({ length: 31 }, (_, i) => i + 1)),
				months: new Set(Array.from({ length: 12 }, (_, i) => i)),
				weekdays: new Set(Array.from({ length: 7 }, (_, i) => i)),
			},
			{ timezone: 'UTC' },
		)
		expect(
			cron.getNextDate(new Date('2024-07-01T00:00:00Z')).toISOString(),
		).toBe('2024-07-01T12:00:00.000Z')
	})

	test('defaults to the local time zone', () => {
		const cron = parseCronExpression('0 9 * * *')
		expect(cron.timezone).toBeUndefined()
		// 09:00 in Asia/Tokyo (UTC+9), the local time zone of this test file.
		expect(
			cron.getNextDate(new Date('2024-07-01T00:00:00Z')).toISOString(),
		).toBe('2024-07-02T00:00:00.000Z')
	})
})
