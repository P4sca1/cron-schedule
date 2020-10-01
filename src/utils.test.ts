import { TIMEOUT_MAX, longTimeout, extractDateElements } from './utils'

describe('longTimeout', () => {
  test('Works with short timeouts', () => {
    jest.useFakeTimers()
    const callback = jest.fn()

    longTimeout(callback, 10000)

    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(callback).not.toBeCalled()
    jest.runAllTimers()
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('Works with long timeouts (1 extra iteration)', () => {
    jest.useFakeTimers()
    const callback = jest.fn()

    longTimeout(callback, TIMEOUT_MAX + 1)

    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(callback).not.toBeCalled()
    jest.runOnlyPendingTimers()
    expect(setTimeout).toHaveBeenCalledTimes(2)
    expect(callback).not.toBeCalled()
    jest.runAllTimers()
    expect(setTimeout).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('Works with long timeouts (2 extra iterations)', () => {
    jest.useFakeTimers()
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
    jest.runAllTimers()
    expect(setTimeout).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledTimes(1)
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
