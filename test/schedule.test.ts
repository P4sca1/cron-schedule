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
  test('Should correctly get the next date', () => {
    expect(
      parseCronExpression('*/5 * * * *').getNextDate(
        new Date(2001, 2, 12, 0, 37, 48)
      )
    ).toStrictEqual(new Date(2001, 2, 12, 0, 40, 0))

    expect(
      parseCronExpression('10,20 5,15 * * *').getNextDate(
        new Date(2020, 9, 3, 10, 15)
      )
    ).toStrictEqual(new Date(2020, 9, 3, 15, 10))

    expect(
      parseCronExpression('@weekly').getNextDate(new Date(2020, 9, 2, 20, 5, 7))
    ).toStrictEqual(new Date(2020, 9, 4, 0, 0, 0))

    expect(
      parseCronExpression('@yearly').getNextDate(
        new Date(2020, 9, 5, 18, 50, 2)
      )
    ).toStrictEqual(new Date(2021, 0, 1, 0, 0, 0))

    expect(
      parseCronExpression('0 0 31 12 *').getNextDate(
        new Date(2020, 9, 5, 18, 50, 2)
      )
    ).toStrictEqual(new Date(2020, 11, 31, 0, 0, 0))
  })

  test('Should correctly get the next dates', () => {
    expect(
      parseCronExpression('*/5 * * * *').getNextDates(
        5,
        new Date(2001, 2, 12, 0, 37, 48)
      )
    ).toStrictEqual([
      new Date(2001, 2, 12, 0, 40, 0),
      new Date(2001, 2, 12, 0, 45, 0),
      new Date(2001, 2, 12, 0, 50, 0),
      new Date(2001, 2, 12, 0, 55, 0),
      new Date(2001, 2, 12, 1, 0, 0),
    ])

    expect(
      parseCronExpression('0 0 31 * *').getNextDates(
        7,
        new Date(2020, 0, 1, 0, 0, 0)
      )
    ).toStrictEqual([
      new Date(2020, 0, 31, 0, 0, 0),
      new Date(2020, 2, 31, 0, 0, 0),
      new Date(2020, 4, 31, 0, 0, 0),
      new Date(2020, 6, 31, 0, 0, 0),
      new Date(2020, 7, 31, 0, 0, 0),
      new Date(2020, 9, 31, 0, 0, 0),
      new Date(2020, 11, 31, 0, 0, 0),
    ])
  })

  test('Should work with leap years', () => {
    const startDate = new Date(2020, 0, 1, 0, 0, 0)
    const schedule = parseCronExpression('0 0 29 2 *')
    expect(schedule.getNextDates(3, startDate)).toStrictEqual([
      new Date(2020, 1, 29, 0, 0, 0),
      new Date(2024, 1, 29, 0, 0, 0),
      new Date(2028, 1, 29, 0, 0, 0),
    ])
  })
})

describe('getPrevDate(s)', () => {
  test('Should correctly get the previous date', () => {
    expect(
      parseCronExpression('*/5 * * * *').getPrevDate(
        new Date(2001, 2, 12, 0, 37, 48)
      )
    ).toStrictEqual(new Date(2001, 2, 12, 0, 35, 0))

    expect(
      parseCronExpression('10,20 5,15 * * *').getPrevDate(
        new Date(2020, 9, 3, 10, 15)
      )
    ).toStrictEqual(new Date(2020, 9, 3, 5, 20))

    expect(
      parseCronExpression('@weekly').getPrevDate(new Date(2020, 9, 2, 20, 5, 7))
    ).toStrictEqual(new Date(2020, 8, 27, 0, 0, 0))

    expect(
      parseCronExpression('@yearly').getPrevDate(
        new Date(2021, 9, 5, 18, 50, 2)
      )
    ).toStrictEqual(new Date(2021, 0, 1, 0, 0, 0))

    expect(
      parseCronExpression('0 0 31 12 *').getPrevDate(
        new Date(2020, 9, 5, 18, 50, 2)
      )
    ).toStrictEqual(new Date(2019, 11, 31, 0, 0, 0))
  })

  test('Should correctly get the previous dates', () => {
    expect(
      parseCronExpression('*/5 * * * *').getPrevDates(
        9,
        new Date(2001, 2, 12, 0, 37, 48)
      )
    ).toStrictEqual([
      new Date(2001, 2, 12, 0, 35, 0),
      new Date(2001, 2, 12, 0, 30, 0),
      new Date(2001, 2, 12, 0, 25, 0),
      new Date(2001, 2, 12, 0, 20, 0),
      new Date(2001, 2, 12, 0, 15, 0),
      new Date(2001, 2, 12, 0, 10, 0),
      new Date(2001, 2, 12, 0, 5, 0),
      new Date(2001, 2, 12, 0, 0, 0),
      new Date(2001, 2, 11, 23, 55, 0),
    ])

    expect(
      parseCronExpression('0 0 31 * *').getPrevDates(
        7,
        new Date(2020, 0, 1, 0, 0, 0)
      )
    ).toStrictEqual([
      new Date(2019, 11, 31, 0, 0, 0),
      new Date(2019, 9, 31, 0, 0, 0),
      new Date(2019, 7, 31, 0, 0, 0),
      new Date(2019, 6, 31, 0, 0, 0),
      new Date(2019, 4, 31, 0, 0, 0),
      new Date(2019, 2, 31, 0, 0, 0),
      new Date(2019, 0, 31, 0, 0, 0),
    ])
  })

  test('Should work with leap years', () => {
    const startDate = new Date(2020, 0, 1, 0, 0, 0)
    const schedule = parseCronExpression('0 0 29 2 *')
    expect(schedule.getPrevDates(3, startDate)).toStrictEqual([
      new Date(2016, 1, 29, 0, 0, 0),
      new Date(2012, 1, 29, 0, 0, 0),
      new Date(2008, 1, 29, 0, 0, 0),
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
