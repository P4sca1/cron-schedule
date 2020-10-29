import { parseCronExpression, TimerBasedCronScheduler } from '../../src'

describe('TimerBasedCronScheduler', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  test('setTimeout', () => {
    const cron = parseCronExpression('* * * * *')
    const task = jest.fn()
    TimerBasedCronScheduler.setTimeout(cron, task)

    expect(jest.getTimerCount()).toBe(1)
    jest.runOnlyPendingTimers()
    expect(task).toHaveBeenCalledTimes(1)
    expect(jest.getTimerCount()).toBe(0)
  })

  test('setInterval', () => {
    const cron = parseCronExpression('* * * * *')
    const task = jest.fn()
    TimerBasedCronScheduler.setInterval(cron, task)

    expect(jest.getTimerCount()).toBe(1)
    jest.runOnlyPendingTimers()
    expect(task).toHaveBeenCalledTimes(1)
    expect(jest.getTimerCount()).toBe(1)
    jest.runOnlyPendingTimers()
    expect(task).toHaveBeenCalledTimes(2)
    expect(jest.getTimerCount()).toBe(1)
  })

  test('clearTimeout', () => {
    const cron = parseCronExpression('* * * * *')
    const task = jest.fn()
    const handle = TimerBasedCronScheduler.setTimeout(cron, task)

    expect(jest.getTimerCount()).toBe(1)
    TimerBasedCronScheduler.clearTimeoutOrInterval(handle)
    expect(clearTimeout).toBeCalledWith(handle.timeoutId)
    expect(jest.getTimerCount()).toBe(0)
    expect(task).not.toBeCalled()
  })
})
