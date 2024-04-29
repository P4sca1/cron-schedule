import { afterEach, describe, expect, test, vi } from 'vitest'
import { parseCronExpression } from '../../src/index.js'
import { TimerBasedCronScheduler } from '../../src/schedulers/timer-based.js'

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
