import { parseCronExpression } from '../src/cron-parser'
import { Schedule } from '../src/schedule'

describe('constructor', () => {
  test('should create an array from the set in ascending order', () => {
    const schedule = new Schedule({
      seconds: new Set([23, 10, 17]),
      minutes: new Set([5, 4, 2]),
      hours: new Set([0, 1]),
      days: new Set([12]),
      months: new Set([7, 3]),
      weekdays: new Set([6, 3]),
    })

    expect(schedule.seconds).toStrictEqual([10, 17, 23])
    expect(schedule.minutes).toStrictEqual([2, 4, 5])
    expect(schedule.hours).toStrictEqual([0, 1])
    expect(schedule.days).toStrictEqual([12])
    expect(schedule.months).toStrictEqual([3, 7])
    expect(schedule.weekdays).toStrictEqual([3, 6])
  })

  test('Should throw when a set is empty', () => {
    // @ts-expect-error -- test
    expect(() => new Schedule()).toThrow()
    // @ts-expect-error -- test
    expect(() => new Schedule({})).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([]),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([1]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([1]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([]),
          days: new Set([1]),
          months: new Set([1]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([]),
          months: new Set([1]),
          weekdays: new Set([1]),
        })
    ).not.toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([1]),
          weekdays: new Set([]),
        })
    ).not.toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([]),
          months: new Set([1]),
          weekdays: new Set([]),
        })
    ).toThrow()
  })

  test('Should throw when value is not an integer', () => {
    expect(
      () =>
        new Schedule({
          // @ts-expect-error -- test
          seconds: new Set(['a']),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([1]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([2.5]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([1]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([2.5]),
          days: new Set([1]),
          months: new Set([1]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([1]),
          // @ts-expect-error -- test
          days: new Set([() => undefined]),
          months: new Set([1]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([2.5]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([1]),
          // @ts-expect-error -- test
          weekdays: new Set([{}]),
        })
    ).toThrow()
  })

  test('Should throw when value is outside of an allowed range', () => {
    expect(
      () =>
        new Schedule({
          seconds: new Set([-1]),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([1]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([60]),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([1]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([-1]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([1]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([60]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([1]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([-1]),
          days: new Set([1]),
          months: new Set([1]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([24]),
          days: new Set([1]),
          months: new Set([1]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([0]),
          months: new Set([1]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([32]),
          months: new Set([1]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([-1]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([12]),
          weekdays: new Set([1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([1]),
          weekdays: new Set([-1]),
        })
    ).toThrow()
    expect(
      () =>
        new Schedule({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([1]),
          weekdays: new Set([7]),
        })
    ).toThrow()
  })
})

describe('getNextDate(s)', () => {
  const startDate = new Date(2001, 2, 12, 0, 37, 48)
  const schedule = parseCronExpression('*/5 * * * *')

  test('Should correctly get the next date', () => {
    expect(schedule.getNextDate(startDate)).toStrictEqual(
      new Date(2001, 2, 12, 0, 40, 0)
    )
  })

  test('Should correctly get the next 5 dates', () => {
    expect(schedule.getNextDates(5, startDate)).toStrictEqual([
      new Date(2001, 2, 12, 0, 40, 0),
      new Date(2001, 2, 12, 0, 45, 0),
      new Date(2001, 2, 12, 0, 50, 0),
      new Date(2001, 2, 12, 0, 55, 0),
      new Date(2001, 2, 12, 1, 0, 0),
    ])
  })
})

describe('getPrevDate(s)', () => {
  const startDate = new Date(2001, 2, 12, 0, 37, 48)
  const schedule = parseCronExpression('*/5 * * * *')

  test('Should correctly get the previous date', () => {
    expect(schedule.getPrevDate(startDate)).toStrictEqual(
      new Date(2001, 2, 12, 0, 30, 0)
    )
  })

  test('Should correctly get the previous 8 dates', () => {
    expect(schedule.getPrevDates(8, startDate)).toStrictEqual([
      new Date(2001, 2, 12, 0, 30, 0),
      new Date(2001, 2, 12, 0, 25, 0),
      new Date(2001, 2, 12, 0, 20, 0),
      new Date(2001, 2, 12, 0, 15, 0),
      new Date(2001, 2, 12, 0, 10, 0),
      new Date(2001, 2, 12, 0, 5, 0),
      new Date(2001, 2, 12, 0, 0, 0),
      new Date(2001, 2, 11, 23, 55, 0),
    ])
  })
})

describe('matchDate', () => {
  test('Should return true for a matching date', () => {
    const schedule1 = new Schedule({
      seconds: new Set([0]),
      minutes: new Set([2]),
      hours: new Set([23]),
      days: new Set([12]),
      months: new Set([2]),
      weekdays: new Set([]),
    })
    expect(schedule1.matchDate(new Date(2001, 2, 12, 23, 2, 0))).toBeTruthy()

    const schedule2 = new Schedule({
      seconds: new Set([47, 48, 49]),
      minutes: new Set([37]),
      hours: new Set([0, 1]),
      days: new Set([]),
      months: new Set([2, 3]),
      weekdays: new Set([1]),
    })
    expect(schedule2.matchDate(new Date(2001, 2, 12, 0, 37, 48))).toBeTruthy()
  })

  test('Should return false for a non matching date', () => {
    const schedule1 = new Schedule({
      seconds: new Set([47, 48, 49]),
      minutes: new Set([37]),
      hours: new Set([0, 1]),
      days: new Set([12]),
      months: new Set([2, 3]),
      weekdays: new Set([1]),
    })
    expect(schedule1.matchDate(new Date(2001, 1, 12, 0, 37, 48))).toBeFalsy()
    expect(schedule1.matchDate(new Date(2001, 2, 13, 0, 37, 48))).toBeFalsy()
    expect(schedule1.matchDate(new Date(2001, 2, 12, 2, 37, 48))).toBeFalsy()
    expect(schedule1.matchDate(new Date(2001, 2, 12, 0, 38, 48))).toBeFalsy()
    expect(schedule1.matchDate(new Date(2001, 2, 12, 0, 37, 50))).toBeFalsy()
  })
})

describe('clearTimeoutOrInterval', () => {
  test('Should call clearTimeout with the timeoutId in the handle', () => {
    jest.useFakeTimers()

    const schedule = parseCronExpression('* * * * *')
    const callback = jest.fn()
    const handle = schedule.setTimeout(callback)

    expect(jest.getTimerCount()).toBe(1)
    schedule.clearTimeoutOrInterval(handle)
    expect(clearTimeout).toBeCalledWith(handle.timeoutId)
    expect(jest.getTimerCount()).toBe(0)
    expect(callback).not.toBeCalled()

    jest.clearAllTimers()
  })
})
