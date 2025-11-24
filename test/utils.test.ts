import { describe, expect, test, vi } from 'vitest'
import {
	extractDateElements,
	longTimeout,
	TIMEOUT_MAX,
	wrapFunction,
} from '../src/utils.js'

describe('longTimeout', () => {
	test('Works with short timeouts', () => {
		vi.useFakeTimers()
		const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

		const callback = vi.fn()

		longTimeout(callback, 10000)

		expect(setTimeout).toHaveBeenCalledTimes(1)
		expect(callback).not.toBeCalled()
		vi.runOnlyPendingTimers()
		expect(setTimeout).toHaveBeenCalledTimes(1)
		expect(callback).toHaveBeenCalledTimes(1)

		setTimeoutSpy.mockRestore()
		vi.useRealTimers()
	})

	test('Works with long timeouts (1 extra iteration)', () => {
		vi.useFakeTimers()
		const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

		const callback = vi.fn()

		longTimeout(callback, TIMEOUT_MAX + 1)

		expect(setTimeout).toHaveBeenCalledTimes(1)
		expect(callback).not.toBeCalled()
		vi.runOnlyPendingTimers()
		expect(setTimeout).toHaveBeenCalledTimes(2)
		expect(callback).not.toBeCalled()
		vi.runOnlyPendingTimers()
		expect(setTimeout).toHaveBeenCalledTimes(2)
		expect(callback).toHaveBeenCalledTimes(1)

		setTimeoutSpy.mockRestore()
		vi.useRealTimers()
	})

	test('Works with long timeouts (2 extra iterations)', () => {
		vi.useFakeTimers()
		const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

		const callback = vi.fn()

		longTimeout(callback, TIMEOUT_MAX * 2 + 1)

		expect(setTimeout).toHaveBeenCalledTimes(1)
		expect(callback).not.toBeCalled()
		vi.runOnlyPendingTimers()
		expect(setTimeout).toHaveBeenCalledTimes(2)
		expect(callback).not.toBeCalled()
		vi.runOnlyPendingTimers()
		expect(setTimeout).toHaveBeenCalledTimes(3)
		expect(callback).not.toBeCalled()
		vi.runOnlyPendingTimers()
		expect(setTimeout).toHaveBeenCalledTimes(3)
		expect(callback).toHaveBeenCalledTimes(1)

		setTimeoutSpy.mockRestore()
		vi.useRealTimers()
	})
})

describe('extractDateElements', () => {
	test('Correctly extracts date elements', () => {
		const year = 2001
		const month = 2
		const day = 12
		const hour = 0
		const minute = 37
		const second = 48

		const date = new Date(year, month, day, hour, minute, second)
		const elements = extractDateElements(date)

		expect(elements).toEqual({
			year,
			month,
			day,
			hour,
			minute,
			second,
			weekday: 1,
		})
	})
})

describe('wrapFunction', () => {
	test('Should call errorHandler on error', () => {
		const errorHandler = vi.fn()
		const err = new Error('Test.')
		wrapFunction(() => {
			throw err
		}, errorHandler)()

		expect(errorHandler).toHaveBeenCalledWith(err)
	})

	test('Should catch promise rejections', async () => {
		const errorHandler = vi.fn()
		const err = new Error('Test.')
		wrapFunction(() => {
			return new Promise((_resolve, reject) => {
				reject(err)
			})
		}, errorHandler)()
		await new Promise(setImmediate) // Wait for promises to be handled.
		expect(errorHandler).toHaveBeenCalledWith(err)
	})
})
