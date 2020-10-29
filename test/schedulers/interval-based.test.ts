import { parseCronExpression, IntervalBasedCronScheduler } from '../../src'

describe('TimerBasedCronScheduler', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
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
    jest.spyOn(Date, 'now').mockImplementation(() => now)

    // Test one time task.
    const oneTimeTask = jest.fn()
    scheduler.registerTask(cron, oneTimeTask, true)
    now += 60 * 1000
    jest.runOnlyPendingTimers()
    expect(oneTimeTask).toBeCalledTimes(1)
    now += 60 * 1000
    jest.runOnlyPendingTimers()
    expect(oneTimeTask).toBeCalledTimes(1)

    // Test normal task.
    const task = jest.fn()
    scheduler.registerTask(cron, task)
    now += 60 * 1000
    jest.runOnlyPendingTimers()
    expect(task).toBeCalledTimes(1)
    now += 60 * 1000
    jest.runOnlyPendingTimers()
    expect(task).toBeCalledTimes(2)
  })

  test('unregisterTask', () => {
    const scheduler = new IntervalBasedCronScheduler(60 * 1000)
    const cron = parseCronExpression('* * * * *')
    const task = jest.fn()
    const id = scheduler.registerTask(cron, task)
    scheduler.unregisterTask(id)
    jest.runOnlyPendingTimers()
    expect(task).not.toBeCalled()
  })
})
