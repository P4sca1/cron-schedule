import { afterEach, describe, expect, test, vi } from 'vitest'
import { parseCronExpression } from '../../src/index.js'
import { IntervalBasedCronScheduler } from '../../src/schedulers/interval-based.js'

vi.useFakeTimers()
const setIntervalSpy = vi.spyOn(global, 'setInterval')
const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

describe('TimerBasedCronScheduler', () => {
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
		let now = Date.now()
		vi.spyOn(Date, 'now').mockImplementation(() => now)

		// Test one time task.
		const oneTimeTask = vi.fn()
		scheduler.registerTask(cron, oneTimeTask, { isOneTimeTask: true })
		now += 60 * 1000
		vi.runOnlyPendingTimers()
		expect(oneTimeTask).toBeCalledTimes(1)
		now += 60 * 1000
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
		now += 60 * 1000
		vi.runOnlyPendingTimers()
		expect(errorHandler).toBeCalledTimes(1)

		// Test normal task.
		const task = vi.fn()
		scheduler.registerTask(cron, task)
		now += 60 * 1000
		vi.runOnlyPendingTimers()
		expect(task).toBeCalledTimes(1)
		now += 60 * 1000
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
})
