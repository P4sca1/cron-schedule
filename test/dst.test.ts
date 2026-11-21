import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { parseCronExpression } from '../src/index.ts'

const originalTimeZone = process.env.TZ

function useTimeZone(timeZone: string) {
	beforeAll(() => {
		process.env.TZ = timeZone
	})
	afterAll(() => {
		process.env.TZ = originalTimeZone
	})
}

const iso = (dates: Date[]) => dates.map((date) => date.toISOString())

describe('daylight saving time (America/New_York)', () => {
	useTimeZone('America/New_York')

	describe('skipped hour (2024-03-10 02:00 EST -> 03:00 EDT)', () => {
		test('getNextDates runs a job at a skipped time once right after the skipped hour', () => {
			const cron = parseCronExpression('30 2 * * *')
			expect(
				iso(cron.getNextDates(3, new Date('2024-03-09T12:00:00-05:00'))),
			).toEqual([
				'2024-03-10T07:00:00.000Z', // 03:00 EDT
				'2024-03-11T06:30:00.000Z',
				'2024-03-12T06:30:00.000Z',
			])
		})

		test('getPrevDates is strictly decreasing and mirrors getNextDates', () => {
			const cron = parseCronExpression('30 2 * * *')
			expect(
				iso(cron.getPrevDates(4, new Date('2024-03-11T12:00:00-04:00'))),
			).toEqual([
				'2024-03-11T06:30:00.000Z',
				'2024-03-10T07:00:00.000Z', // 03:00 EDT
				'2024-03-09T07:30:00.000Z',
				'2024-03-08T07:30:00.000Z',
			])
		})

		test('getPrevDatesIterator without end date does not get stuck', () => {
			const iterator = parseCronExpression('30 2 * * *').getPrevDatesIterator(
				new Date('2024-03-10T12:00:00-04:00'),
			)
			const dates = [1, 2, 3].map(() => iterator.next().value as Date)
			expect(iso(dates)).toEqual([
				'2024-03-10T07:00:00.000Z',
				'2024-03-09T07:30:00.000Z',
				'2024-03-08T07:30:00.000Z',
			])
		})

		test('jobs that run every hour skip the non-existent times', () => {
			const cron = parseCronExpression('15,45 * * * *')
			const start = new Date('2024-03-10T01:50:00-05:00')
			const expected = [
				'2024-03-10T07:15:00.000Z', // 03:15 EDT
				'2024-03-10T07:45:00.000Z',
			]
			expect(iso(cron.getNextDates(2, start))).toEqual(expected)
			expect(
				iso(cron.getPrevDates(3, new Date('2024-03-10T03:50:00-04:00'))),
			).toEqual([...expected].reverse().concat('2024-03-10T06:45:00.000Z'))
		})
	})

	describe('repeated hour (2024-11-03 02:00 EDT -> 01:00 EST)', () => {
		test('jobs that run every hour run in both occurrences', () => {
			const expected = [
				'2024-11-03T05:00:00.000Z', // 01:00 EDT
				'2024-11-03T06:00:00.000Z', // 01:00 EST
				'2024-11-03T07:00:00.000Z',
				'2024-11-03T08:00:00.000Z',
			]
			const cron = parseCronExpression('0 * * * *')
			expect(
				iso(cron.getNextDates(4, new Date('2024-11-03T00:30:00-04:00'))),
			).toEqual(expected)
			expect(
				iso(cron.getPrevDates(4, new Date('2024-11-03T03:30:00-05:00'))),
			).toEqual([...expected].reverse())
		})

		test('jobs that run every 30 minutes run in both occurrences', () => {
			const cron = parseCronExpression('*/30 * * * *')
			expect(
				iso(cron.getNextDates(5, new Date('2024-11-03T00:45:00-04:00'))),
			).toEqual([
				'2024-11-03T05:00:00.000Z',
				'2024-11-03T05:30:00.000Z',
				'2024-11-03T06:00:00.000Z',
				'2024-11-03T06:30:00.000Z',
				'2024-11-03T07:00:00.000Z',
			])
		})

		test('jobs that run at specific hours only run on the first occurrence', () => {
			const cron = parseCronExpression('30 1 * * *')
			const expected = [
				'2024-11-03T05:30:00.000Z', // 01:30 EDT
				'2024-11-04T06:30:00.000Z',
			]
			expect(
				iso(cron.getNextDates(2, new Date('2024-11-03T00:00:00-04:00'))),
			).toEqual(expected)
			expect(
				iso(cron.getPrevDates(2, new Date('2024-11-04T12:00:00-05:00'))),
			).toEqual([...expected].reverse())
			// Starting in the second occurrence does not run the job again.
			expect(
				cron.getNextDate(new Date('2024-11-03T01:00:00-05:00')).toISOString(),
			).toBe('2024-11-04T06:30:00.000Z')
		})
	})
})

describe('daylight saving time (Australia/Lord_Howe, 30 minute change)', () => {
	useTimeZone('Australia/Lord_Howe')

	test('multiple skipped times of a job run once right after the skipped period', () => {
		// 2024-10-06 02:00 +10:30 -> 02:30 +11:00
		const cron = parseCronExpression('10,35 2 * * *')
		const expected = [
			'2024-10-05T15:30:00.000Z', // 02:30 +11:00, for the skipped 02:10
			'2024-10-05T15:35:00.000Z', // 02:35 +11:00
		]
		expect(
			iso(cron.getNextDates(2, new Date('2024-10-06T01:00:00+10:30'))),
		).toEqual(expected)
		expect(
			iso(cron.getPrevDates(2, new Date('2024-10-06T03:00:00+11:00'))),
		).toEqual([...expected].reverse())
	})
})

describe('years 0 to 99', () => {
	useTimeZone('UTC')

	test('getPrevDate and getNextDate do not map the years to 1900 to 1999', () => {
		const cron = parseCronExpression('0 0 1 1 *')
		const start = new Date(0)
		start.setUTCFullYear(101, 0, 1)

		expect(cron.getPrevDates(2, start).map((d) => d.getUTCFullYear())).toEqual([
			100, 99,
		])

		start.setUTCFullYear(98, 0, 1)
		expect(cron.getNextDates(2, start).map((d) => d.getUTCFullYear())).toEqual([
			99, 100,
		])
	})
})
