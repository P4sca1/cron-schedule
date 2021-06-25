import {
  TIMEOUT_MAX,
  longTimeout,
  extractDateElements,
  wrapFunction,
} from '../src/utils'

describe('longTimeout', () => {
  test('Works with short timeouts', () => {
    jest.useFakeTimers()
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')

    const callback = jest.fn()

    longTimeout(callback, 10000)

    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(callback).not.toBeCalled()
    jest.runOnlyPendingTimers()
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledTimes(1)

    setTimeoutSpy.mockRestore()
    jest.useRealTimers()
  })

  test('Works with long timeouts (1 extra iteration)', () => {
    jest.useFakeTimers()
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')

    const callback = jest.fn()

    longTimeout(callback, TIMEOUT_MAX + 1)

    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(callback).not.toBeCalled()
    jest.runOnlyPendingTimers()
    expect(setTimeout).toHaveBeenCalledTimes(2)
    expect(callback).not.toBeCalled()
    jest.runOnlyPendingTimers()
    expect(setTimeout).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenCalledTimes(1)

    setTimeoutSpy.mockRestore()
    jest.useRealTimers()
  })

  test('Works with long timeouts (2 extra iterations)', () => {
    jest.useFakeTimers()
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')

    const callback = jest.fn()

    longTimeout(callback, TIMEOUT_MAX * 2 + 1)

    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(callback).not.toBeCalled()
    jest.runOnlyPendingTimers()
    expect(setTimeout).toHaveBeenCalledTimes(2)
    expect(callback).not.toBeCalled()
    jest.runOnlyPendingTimers()
    expect(setTimeout).toHaveBeenCalledTimes(3)
    expect(callback).not.toBeCalled()
    jest.runOnlyPendingTimers()
    expect(setTimeout).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledTimes(1)

    setTimeoutSpy.mockRestore()
    jest.useRealTimers()
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

describe('wrapFunction', function () {
  test('Should call errorHandler on error', () => {
    const errorHandler = jest.fn()
    const err = new Error('Test.')
    wrapFunction(() => {
      throw err
    }, errorHandler)()

    expect(errorHandler).toHaveBeenCalledWith(err)
  })

  test('Should catch promise rejections', async () => {
    const errorHandler = jest.fn()
    const err = new Error('Test.')
    wrapFunction(() => {
      return new Promise((resolve, reject) => {
        reject(err)
      })
    }, errorHandler)()
    await new Promise(setImmediate) // Wait for promises to be handled.
    expect(errorHandler).toHaveBeenCalledWith(err)
  })
})
