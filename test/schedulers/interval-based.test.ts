import { afterEach, describe, expect, test, vi } from 'vitest'
import { parseCronExpression } from '../../src/index.js'
import { IntervalBasedCronScheduler } from '../../src/schedulers/interval-based.js'

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
				// The tasks are due 1, 2 or 3 minutes after the current minute.
				// The time is not set to a fixed date, because Bun does not support vi.setSystemTime.
				const currentMinute = new Date().getMinutes()
				const scheduler = new IntervalBasedCronScheduler(60 * 1000)
				const executed: number[] = []

				for (const minute of minutes) {
					scheduler.registerTask(
						parseCronExpression(`${(currentMinute + minute) % 60} * * * *`),
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
