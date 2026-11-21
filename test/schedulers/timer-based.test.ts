import { afterEach, describe, expect, test, vi } from 'vitest'
import { type Cron, parseCronExpression } from '../../src/index.ts'
import { TimerBasedCronScheduler } from '../../src/schedulers/timer-based.ts'

vi.useFakeTimers()
const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

describe('TimerBasedCronScheduler', () => {
	afterEach(() => {
		vi.clearAllTimers()
		clearTimeoutSpy.mockClear()
	})

	test('setTimeout', () => {
		const cron = parseCronExpression('* * * * *')
		const task = vi.fn()
		TimerBasedCronScheduler.setTimeout(cron, task)

		expect(vi.getTimerCount()).toBe(1)
		vi.runOnlyPendingTimers()
		expect(task).toHaveBeenCalledTimes(1)
		expect(vi.getTimerCount()).toBe(0)
	})

	test('setTimeout shold correctly handle errors', () => {
		const cron = parseCronExpression('* * * * *')
		const task = () => {
			throw new Error('Test.')
		}
		const errorHandler = vi.fn()
		TimerBasedCronScheduler.setTimeout(cron, task, { errorHandler })

		expect(vi.getTimerCount()).toBe(1)
		vi.runOnlyPendingTimers()
		expect(errorHandler).toHaveBeenCalledTimes(1)
		expect(vi.getTimerCount()).toBe(0)
	})

	test('setInterval', () => {
		const cron = parseCronExpression('* * * * *')
		const task = vi.fn()
		TimerBasedCronScheduler.setInterval(cron, task)

		expect(vi.getTimerCount()).toBe(1)
		vi.runOnlyPendingTimers()
		expect(task).toHaveBeenCalledTimes(1)
		expect(vi.getTimerCount()).toBe(1)
		vi.runOnlyPendingTimers()
		expect(task).toHaveBeenCalledTimes(2)
		expect(vi.getTimerCount()).toBe(1)
	})

	test('setInterval shold correctly handle errors', () => {
		const cron = parseCronExpression('* * * * *')
		const task = () => {
			throw new Error('Test.')
		}
		const errorHandler = vi.fn()
		TimerBasedCronScheduler.setInterval(cron, task, { errorHandler })

		expect(vi.getTimerCount()).toBe(1)
		vi.runOnlyPendingTimers()
		expect(errorHandler).toHaveBeenCalledTimes(1)
		expect(vi.getTimerCount()).toBe(1)
		vi.runOnlyPendingTimers()
		expect(errorHandler).toHaveBeenCalledTimes(2)
		expect(vi.getTimerCount()).toBe(1)
	})

	test('clearTimeout', () => {
		const cron = parseCronExpression('* * * * *')
		const task = vi.fn()
		const handle = TimerBasedCronScheduler.setTimeout(cron, task)

		expect(vi.getTimerCount()).toBe(1)
		TimerBasedCronScheduler.clearTimeoutOrInterval(handle)
		expect(clearTimeout).toBeCalledWith(handle.timeoutId)
		expect(vi.getTimerCount()).toBe(0)
		expect(task).not.toBeCalled()
	})
})

describe('TimerBasedCronScheduler with dates beyond the timeout limit', () => {
	const DAY = 24 * 60 * 60 * 1000

	/** A cron stub that is due every 30 days (more than the timeout limit of ~24.8 days). */
	const cron = {
		getNextDate: () => new Date(Date.now() + 30 * DAY),
	} as unknown as Cron

	afterEach(() => {
		vi.clearAllTimers()
	})

	test('setTimeout can be cleared after the first timeout', () => {
		const task = vi.fn()
		const handle = TimerBasedCronScheduler.setTimeout(cron, task)

		vi.advanceTimersByTime(25 * DAY)
		expect(vi.getTimerCount()).toBe(1)
		TimerBasedCronScheduler.clearTimeoutOrInterval(handle)
		expect(vi.getTimerCount()).toBe(0)
		vi.advanceTimersByTime(10 * DAY)
		expect(task).not.toBeCalled()
	})

	test('setInterval executes the task every 30 days', () => {
		const task = vi.fn()
		TimerBasedCronScheduler.setInterval(cron, task)

		vi.advanceTimersByTime(30 * DAY)
		expect(task).toHaveBeenCalledTimes(1)
		vi.advanceTimersByTime(30 * DAY)
		expect(task).toHaveBeenCalledTimes(2)
		expect(vi.getTimerCount()).toBe(1)
	})

	test('setInterval can be cleared after the first timeout', () => {
		const task = vi.fn()
		const handle = TimerBasedCronScheduler.setInterval(cron, task)

		vi.advanceTimersByTime(30 * DAY)
		vi.advanceTimersByTime(25 * DAY)
		expect(task).toHaveBeenCalledTimes(1)
		TimerBasedCronScheduler.clearTimeoutOrInterval(handle)
		expect(vi.getTimerCount()).toBe(0)
		vi.advanceTimersByTime(40 * DAY)
		expect(task).toHaveBeenCalledTimes(1)
	})
})

describe('TimerBasedCronScheduler.setInterval', () => {
	afterEach(() => {
		vi.clearAllTimers()
	})

	test('can be cleared by the task itself', () => {
		const cron = parseCronExpression('* * * * *')
		const handle = TimerBasedCronScheduler.setInterval(cron, () => {
			TimerBasedCronScheduler.clearTimeoutOrInterval(handle)
		})

		vi.runOnlyPendingTimers()
		expect(vi.getTimerCount()).toBe(0)
	})
})

describe('TimerBasedCronScheduler.setInterval without a next date', () => {
	test('executes the due task and passes the error to the error handler', () => {
		const error = new Error('No valid next date was found.')
		let calls = 0
		const cron = {
			getNextDate: () => {
				calls += 1
				if (calls > 1) {
					throw error
				}
				return new Date(Date.now() + 60 * 1000)
			},
		} as unknown as Cron
		const task = vi.fn()
		const errorHandler = vi.fn()
		TimerBasedCronScheduler.setInterval(cron, task, { errorHandler })

		expect(() => vi.runOnlyPendingTimers()).not.toThrow()
		expect(task).toHaveBeenCalledTimes(1)
		expect(errorHandler).toHaveBeenCalledWith(error)
		expect(vi.getTimerCount()).toBe(0)
	})
})
