import { afterEach, describe, expect, test, vi } from 'vitest'
import { type Cron, parseCronExpression } from '../../src/index.ts'
import { IntervalBasedCronScheduler } from '../../src/schedulers/interval-based.ts'

/**
 * Creates a cron stub that is due the given amount of minutes after start and then every hour.
 * The deadlines are relative to the fake clock, so the tests neither depend on the local time zone
 * (e.g. daylight saving time changes) nor on vi.setSystemTime, which Bun does not support.
 */
function cronDueAfterMinutes(start: number, minutes: number): Cron {
	const deadline = start + minutes * 60 * 1000
	return {
		getNextDate: () =>
			new Date(Date.now() < deadline ? deadline : deadline + 60 * 60 * 1000),
	} as unknown as Cron
}

vi.useFakeTimers()
const setIntervalSpy = vi.spyOn(global, 'setInterval')
const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

describe('IntervalBasedCronScheduler', () => {
	afterEach(() => {
		vi.clearAllTimers()
		setIntervalSpy.mockClear()
		clearIntervalSpy.mockClear()
	})

	test('start', () => {
		const scheduler = new IntervalBasedCronScheduler(60 * 1000)
		expect(setInterval).toBeCalledTimes(1)
		expect(() => scheduler.start()).toThrowError('Scheduler already started.')
		scheduler.stop()
		expect(() => scheduler.start()).not.toThrow()
		expect(setInterval).toBeCalledTimes(2)
	})

	test('stop', () => {
		const scheduler = new IntervalBasedCronScheduler(60 * 1000)
		expect(() => scheduler.stop()).not.toThrow()
		expect(clearInterval).toBeCalledTimes(1)
	})

	test('registerTask', () => {
		const scheduler = new IntervalBasedCronScheduler(60 * 1000)
		const cron = parseCronExpression('* * * * *')

		// Test one time task.
		const oneTimeTask = vi.fn()
		scheduler.registerTask(cron, oneTimeTask, { isOneTimeTask: true })
		vi.runOnlyPendingTimers()
		expect(oneTimeTask).toBeCalledTimes(1)
		vi.runOnlyPendingTimers()
		expect(oneTimeTask).toBeCalledTimes(1)

		// Test error handling.
		const errorTask = () => {
			throw new Error('Test.')
		}
		const errorHandler = vi.fn()
		scheduler.registerTask(cron, errorTask, {
			isOneTimeTask: true,
			errorHandler,
		})
		vi.runOnlyPendingTimers()
		expect(errorHandler).toBeCalledTimes(1)

		// Test normal task.
		const task = vi.fn()
		scheduler.registerTask(cron, task)
		vi.runOnlyPendingTimers()
		expect(task).toBeCalledTimes(1)
		vi.runOnlyPendingTimers()
		expect(task).toBeCalledTimes(2)
	})

	test('unregisterTask', () => {
		const scheduler = new IntervalBasedCronScheduler(60 * 1000)
		const cron = parseCronExpression('* * * * *')
		const task = vi.fn()
		const id = scheduler.registerTask(cron, task)
		scheduler.unregisterTask(id)
		vi.runOnlyPendingTimers()
		expect(task).not.toBeCalled()
	})

	describe.each([true, false])('task order (one time: %s)', (isOneTimeTask) => {
		test.each([[[1, 2, 3]], [[3, 2, 1]], [[2, 3, 1]], [[1, 1, 2]]])(
			'dispatches registration order %j at each deadline',
			(minutes) => {
				const start = Date.now()
				const scheduler = new IntervalBasedCronScheduler(60 * 1000)
				const executed: number[] = []

				for (const minute of minutes) {
					scheduler.registerTask(
						cronDueAfterMinutes(start, minute),
						() => executed.push(minute),
						{ isOneTimeTask },
					)
				}

				for (let minute = 1; minute <= 3; minute += 1) {
					vi.advanceTimersByTime(60 * 1000)
					expect(executed).toEqual(
						minutes.filter((value) => value <= minute).sort((a, b) => a - b),
					)
				}
			},
		)
	})
})
