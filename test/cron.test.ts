import { parseCronExpression } from '../src/cron-parser'
import { Cron } from '../src/cron'

describe('constructor', () => {
  test('should create an array from the set in ascending order', () => {
    const cron = new Cron({
      seconds: new Set([23, 10, 17]),
      minutes: new Set([5, 4, 2]),
      hours: new Set([0, 1]),
      days: new Set([12]),
      months: new Set([7, 3]),
      weekdays: new Set([6, 3]),
    })

    expect(cron.seconds).toStrictEqual([10, 17, 23])
    expect(cron.minutes).toStrictEqual([2, 4, 5])
    expect(cron.hours).toStrictEqual([0, 1])
    expect(cron.days).toStrictEqual([12])
    expect(cron.months).toStrictEqual([3, 7])
    expect(cron.weekdays).toStrictEqual([3, 6])
  })

  test('Should throw when a set is empty', () => {
    // @ts-expect-error -- test
    expect(() => new Cron()).toThrow()
    // @ts-expect-error -- test
    expect(() => new Cron({})).toThrow()
    expect(
      () =>
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
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
        new Cron({
          seconds: new Set([1]),
          minutes: new Set([1]),
          hours: new Set([1]),
          days: new Set([1]),
          months: new Set([1]),
          weekdays: new Set([8]),
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
    const cron = parseCronExpression('0 0 29 2 *')
    expect(cron.getNextDates(3, startDate)).toStrictEqual([
      new Date(2020, 1, 29, 0, 0, 0),
      new Date(2024, 1, 29, 0, 0, 0),
      new Date(2028, 1, 29, 0, 0, 0),
    ])
  })
})

describe('getNextDatesIterator', () => {
  test('Should yield the correct next dates', () => {
    const nextDates = parseCronExpression('* * * * *').getNextDatesIterator(
      new Date(2020, 10, 1, 0, 0, 0),
      new Date(2020, 10, 1, 0, 59, 0)
    )

    let i = 1
    for (const date of nextDates) {
      expect(date).toStrictEqual(new Date(2020, 10, 1, 0, i, 0))
      i += 1
    }
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
    const cron = parseCronExpression('0 0 29 2 *')
    expect(cron.getPrevDates(3, startDate)).toStrictEqual([
      new Date(2016, 1, 29, 0, 0, 0),
      new Date(2012, 1, 29, 0, 0, 0),
      new Date(2008, 1, 29, 0, 0, 0),
    ])
  })
})

describe('getPrevDatesIterator', () => {
  test('Should yield the correct previous dates', () => {
    const nextDates = parseCronExpression('* * * * *').getPrevDatesIterator(
      new Date(2020, 10, 1, 0, 59, 0),
      new Date(2020, 10, 1, 0, 0, 0)
    )

    let i = 1
    for (const date of nextDates) {
      expect(date).toStrictEqual(new Date(2020, 10, 1, 0, 59 - i, 0))
      i += 1
    }
  })
})

describe('matchDate', () => {
  test('Should return true for a matching date', () => {
    const cron1 = new Cron({
      seconds: new Set([0]),
      minutes: new Set([2]),
      hours: new Set([23]),
      days: new Set([12]),
      months: new Set([2]),
      weekdays: new Set([]),
    })
    expect(cron1.matchDate(new Date(2001, 2, 12, 23, 2, 0))).toBeTruthy()

    const cron2 = new Cron({
      seconds: new Set([47, 48, 49]),
      minutes: new Set([37]),
      hours: new Set([0, 1]),
      days: new Set([]),
      months: new Set([2, 3]),
      weekdays: new Set([1]),
    })
    expect(cron2.matchDate(new Date(2001, 2, 12, 0, 37, 48))).toBeTruthy()
  })

  test('Should return false for a non matching date', () => {
    const cron = new Cron({
      seconds: new Set([47, 48, 49]),
      minutes: new Set([37]),
      hours: new Set([0, 1]),
      days: new Set([12]),
      months: new Set([2, 3]),
      weekdays: new Set([1]),
    })
    expect(cron.matchDate(new Date(2001, 1, 12, 0, 37, 48))).toBeFalsy()
    expect(cron.matchDate(new Date(2001, 2, 13, 0, 37, 48))).toBeFalsy()
    expect(cron.matchDate(new Date(2001, 2, 12, 2, 37, 48))).toBeFalsy()
    expect(cron.matchDate(new Date(2001, 2, 12, 0, 38, 48))).toBeFalsy()
    expect(cron.matchDate(new Date(2001, 2, 12, 0, 37, 50))).toBeFalsy()
  })

  // https://github.com/P4sca1/cron-schedule/issues/270
  test('It should only match on weekday, when day of month is not restricted', () => {
    const cron = parseCronExpression('* * * * 6') // Only match on Saturdays.
    expect(cron.matchDate(new Date(2022, 3, 18))).toBeFalsy() // Monday
    expect(cron.matchDate(new Date(2022, 3, 19))).toBeFalsy()
    expect(cron.matchDate(new Date(2022, 3, 20))).toBeFalsy()
    expect(cron.matchDate(new Date(2022, 3, 21))).toBeFalsy()
    expect(cron.matchDate(new Date(2022, 3, 22))).toBeFalsy()
    expect(cron.matchDate(new Date(2022, 3, 23))).toBeTruthy()
    expect(cron.matchDate(new Date(2022, 3, 24))).toBeFalsy()
  })

  test('It should only match on day of month, when weekday is not restricted', () => {
    const cron = parseCronExpression('* * 1 * *') // Only match on the first of every month.
    expect(cron.matchDate(new Date(2022, 4, 1))).toBeTruthy()
    expect(cron.matchDate(new Date(2022, 4, 2))).toBeFalsy()
  })
})
