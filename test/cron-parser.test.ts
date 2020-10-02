import { parseCronExpression } from '../src/cron-parser'
import { Schedule } from '../src/schedule'

describe('parseCronExpression', () => {
  test('Should parse a cron expression into a schedule instance', () => {
    expect(parseCronExpression('* * * * * *')).toBeInstanceOf(Schedule)
  })

  test('Should parse asterix to an empty array', () => {
    expect(parseCronExpression('* * * * * *').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [],
      weekdays: [],
    })
  })

  test('Should correctly parse single numbers', () => {
    expect(parseCronExpression('1 2 3 4 5 6').next).toStrictEqual({
      seconds: [1],
      minutes: [2],
      hours: [3],
      days: [4],
      months: [5],
      weekdays: [6],
    })
  })

  test('Should correctly parse lists', () => {
    const {
      seconds,
      minutes,
      hours,
      days,
      months,
      weekdays,
    } = parseCronExpression('1,2 2,3,4 4,5,6 7,8 9,10,11 0,1,2').next

    expect(seconds.map((x) => x).sort()).toStrictEqual([1, 2].sort())
    expect(minutes.map((x) => x).sort()).toStrictEqual([2, 3, 4].sort())
    expect(hours.map((x) => x).sort()).toStrictEqual([4, 5, 6].sort())
    expect(days.map((x) => x).sort()).toStrictEqual([7, 8].sort())
    expect(months.map((x) => x).sort()).toStrictEqual([9, 10, 11].sort())
    expect(weekdays.map((x) => x).sort()).toStrictEqual([0, 1, 2].sort())
  })

  test('Should correctly parse ranges', () => {
    const {
      seconds,
      minutes,
      hours,
      days,
      months,
      weekdays,
    } = parseCronExpression('1-3 2-6 3-22 4-10 5-11 0-6').next

    expect(seconds.map((x) => x).sort()).toStrictEqual([1, 2, 3].sort())
    expect(minutes.map((x) => x).sort()).toStrictEqual([2, 3, 4, 5, 6].sort())
    expect(hours.map((x) => x).sort()).toStrictEqual(
      [
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
      ].sort()
    )
    expect(days.map((x) => x).sort()).toStrictEqual(
      [4, 5, 6, 7, 8, 9, 10].sort()
    )
    expect(months.map((x) => x).sort()).toStrictEqual(
      [5, 6, 7, 8, 9, 10, 11].sort()
    )
    expect(weekdays.map((x) => x).sort()).toStrictEqual(
      [0, 1, 2, 3, 4, 5, 6].sort()
    )
  })

  test('Should correctly parse ranges in lists', () => {
    const {
      seconds,
      minutes,
      hours,
      days,
      months,
      weekdays,
    } = parseCronExpression(
      '1-3,7,9-11 2,3,2-6 1,3-22,2 2,3,4-10 1,5-11 0-6,7'
    ).next

    expect(seconds.map((x) => x).sort()).toStrictEqual(
      [1, 2, 3, 7, 9, 10, 11].sort()
    )
    expect(minutes.map((x) => x).sort()).toStrictEqual([2, 3, 4, 5, 6].sort())
    expect(hours.map((x) => x).sort()).toStrictEqual(
      [
        1,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        2,
      ].sort()
    )
    expect(days.map((x) => x).sort()).toStrictEqual(
      [2, 3, 4, 5, 6, 7, 8, 9, 10].sort()
    )
    expect(months.map((x) => x).sort()).toStrictEqual(
      [1, 5, 6, 7, 8, 9, 10, 11].sort()
    )
    expect(weekdays.map((x) => x).sort()).toStrictEqual(
      [0, 1, 2, 3, 4, 5, 6].sort()
    )
  })

  test('Should correctly parse step values', () => {
    const {
      seconds,
      minutes,
      hours,
      days,
      months,
      weekdays,
    } = parseCronExpression('*/10 2-10/3 0-9/2 5-11/4 */2 0-6/3').next

    expect(seconds.map((x) => x).sort()).toStrictEqual(
      [0, 10, 20, 30, 40, 50].sort()
    )
    expect(minutes.map((x) => x).sort()).toStrictEqual([2, 5, 8].sort())
    expect(hours.map((x) => x).sort()).toStrictEqual([0, 2, 4, 6, 8].sort())
    expect(days.map((x) => x).sort()).toStrictEqual([5, 9].sort())
    expect(months.map((x) => x).sort()).toStrictEqual(
      [1, 3, 5, 7, 9, 11].sort()
    )
    expect(weekdays.map((x) => x).sort()).toStrictEqual([0, 3, 6].sort())
  })

  test('Should correctly parse month names', () => {
    expect(parseCronExpression('* * * * jan *').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [1],
      weekdays: [],
    })

    expect(parseCronExpression('* * * * feb *').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [2],
      weekdays: [],
    })

    expect(parseCronExpression('* * * * MAR *').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [3],
      weekdays: [],
    })

    expect(parseCronExpression('* * * * ApR *').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [4],
      weekdays: [],
    })

    expect(parseCronExpression('* * * * maY *').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [5],
      weekdays: [],
    })

    expect(parseCronExpression('* * * * jun *').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [6],
      weekdays: [],
    })

    expect(parseCronExpression('* * * * jul *').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [7],
      weekdays: [],
    })

    expect(parseCronExpression('* * * * aug *').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [8],
      weekdays: [],
    })

    expect(parseCronExpression('* * * * sep *').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [9],
      weekdays: [],
    })

    expect(parseCronExpression('* * * * oct *').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [10],
      weekdays: [],
    })

    expect(parseCronExpression('* * * * nov *').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [11],
      weekdays: [],
    })

    expect(parseCronExpression('* * * * dec *').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [12],
      weekdays: [],
    })

    expect(parseCronExpression('* * * * jan,nov *').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [1, 11],
      weekdays: [],
    })

    expect(parseCronExpression('* * * * jun-sep *').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [6, 7, 8, 9],
      weekdays: [],
    })
  })

  test('Should correctly parse weekday names', () => {
    expect(parseCronExpression('* * * * * sun').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [],
      weekdays: [0],
    })

    expect(parseCronExpression('* * * * * Mon').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [],
      weekdays: [1],
    })

    expect(parseCronExpression('* * * * * Tue').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [],
      weekdays: [2],
    })

    expect(parseCronExpression('* * * * * WeD').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [],
      weekdays: [3],
    })

    expect(parseCronExpression('* * * * * THU').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [],
      weekdays: [4],
    })

    expect(parseCronExpression('* * * * * fri').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [],
      weekdays: [5],
    })

    expect(parseCronExpression('* * * * * sat').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [],
      weekdays: [6],
    })

    expect(parseCronExpression('* * * * * mon,tue').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [],
      weekdays: [1, 2],
    })

    expect(parseCronExpression('* * * * * thu-sat').next).toStrictEqual({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [],
      weekdays: [4, 5, 6],
    })
  })

  test('Should default to 0 when no seconds are specified in the cron expression', () => {
    expect(parseCronExpression('5 0 * * *').next.seconds).toStrictEqual([0])
    expect(parseCronExpression('15 14 1 * *').next.seconds).toStrictEqual([0])
    expect(parseCronExpression('23 0-23/2 * * *').next.seconds).toStrictEqual([
      0,
    ])
  })

  test('Should parse both 0 and 7 for weekday as sunday', () => {
    expect(parseCronExpression('* * * * * 0').next.weekdays).toEqual([0])
    expect(parseCronExpression('* * * * * 7').next.weekdays).toEqual([0])
  })

  test('Should parse @yearly', () => {
    expect(parseCronExpression('@yearly')).toStrictEqual(
      parseCronExpression('0 0 1 1 *')
    )
  })

  test('Should parse @monthly', () => {
    expect(parseCronExpression('@MONTHLY')).toStrictEqual(
      parseCronExpression('0 0 1 1 *')
    )
  })

  test('Should parse @weekly', () => {
    expect(parseCronExpression('@Weekly')).toStrictEqual(
      parseCronExpression('0 0 * * 0')
    )
  })

  test('Should parse @daily', () => {
    expect(parseCronExpression('@dailY')).toStrictEqual(
      parseCronExpression('0 0 * * *')
    )
  })

  test('Should parse @hourly', () => {
    expect(parseCronExpression('@hourly')).toStrictEqual(
      parseCronExpression('0 * * * *')
    )
  })

  test('Should parse @minutely', () => {
    expect(parseCronExpression('@minutely')).toStrictEqual(
      parseCronExpression('* * * * *')
    )
  })

  test('Should parse @secondly', () => {
    expect(parseCronExpression('@secondly')).toStrictEqual(
      parseCronExpression('* * * * * *')
    )
  })

  test('Should throw error on invalid cron string', () => {
    expect(() => parseCronExpression('')).toThrow(
      new Error('Invalid cron expression: expected 5 or 6 elements.')
    )
    // @ts-expect-error -- test without argument
    expect(() => parseCronExpression()).toThrow(
      new Error('Invalid cron expression: must be of type string.')
    )
    // @ts-expect-error -- test with number argument
    expect(() => parseCronExpression(0)).toThrow(
      new Error('Invalid cron expression: must be of type string.')
    )
    expect(() => parseCronExpression('0 0 0 0')).toThrow(
      new Error('Invalid cron expression: expected 5 or 6 elements.')
    )
    expect(() => parseCronExpression('* * * * * * *')).toThrow(
      new Error('Invalid cron expression: expected 5 or 6 elements.')
    )
    expect(() => parseCronExpression('60 * * * * *')).toThrow(
      new Error(
        'Failed to parse 60: 60 is outside of constraint range of 0 - 59.'
      )
    )
    expect(() => parseCronExpression('-1 * * * * *')).toThrow(
      new Error(
        'Failed to parse -1: -1 is outside of constraint range of 0 - 59.'
      )
    )
    expect(() => parseCronExpression('* 60 * * * *')).toThrow(
      new Error(
        'Failed to parse 60: 60 is outside of constraint range of 0 - 59.'
      )
    )
    expect(() => parseCronExpression('* -1 * * * *')).toThrow(
      new Error(
        'Failed to parse -1: -1 is outside of constraint range of 0 - 59.'
      )
    )
    expect(() => parseCronExpression('* * 24 * * *')).toThrow(
      new Error(
        'Failed to parse 24: 24 is outside of constraint range of 0 - 23.'
      )
    )
    expect(() => parseCronExpression('* * -1 * * *')).toThrow(
      new Error(
        'Failed to parse -1: -1 is outside of constraint range of 0 - 23.'
      )
    )
    expect(() => parseCronExpression('* * * 32 * *')).toThrow(
      new Error(
        'Failed to parse 32: 32 is outside of constraint range of 1 - 31.'
      )
    )
    expect(() => parseCronExpression('* * * 0 * *')).toThrow(
      new Error(
        'Failed to parse 0: 0 is outside of constraint range of 1 - 31.'
      )
    )
    expect(() => parseCronExpression('* * * * 13 *')).toThrow(
      new Error(
        'Failed to parse 13: 13 is outside of constraint range of 1 - 12.'
      )
    )
    expect(() => parseCronExpression('* * * * 0 *')).toThrow(
      new Error(
        'Failed to parse 0: 0 is outside of constraint range of 1 - 12.'
      )
    )
    expect(() => parseCronExpression('* * * * * 8')).toThrow(
      new Error('Failed to parse 8: 8 is outside of constraint range of 0 - 6.')
    )
    expect(() => parseCronExpression('* * * * * -1')).toThrow(
      new Error(
        'Failed to parse -1: -1 is outside of constraint range of 0 - 6.'
      )
    )
    expect(() => parseCronExpression('** * * * * *')).toThrow(
      new Error('Failed to parse **: ** is NaN.')
    )
    expect(() => parseCronExpression('0,, * * * * *')).toThrow(
      new Error('Failed to parse :  is NaN.')
    )
    expect(() => parseCronExpression('2-abc * * * * *')).toThrow(
      new Error('Failed to parse 2-abc: abc is NaN.')
    )
    expect(() => parseCronExpression('*/ * * * * *')).toThrow(
      new Error('Failed to parse */: */ is NaN.')
    )
    expect(() => parseCronExpression('*/* * * * * *')).toThrow(
      new Error('Failed to parse */*: */* is NaN.')
    )
    expect(() => parseCronExpression('1-2 * * * * *')).toThrow(
      new Error('Failed to parse 1-2: Invalid range (start: 1, end: 2).')
    )
    expect(() => parseCronExpression('* * * * * sun-mon')).toThrow(
      new Error('Failed to parse sun-mon: Invalid range (start: 0, end: 1).')
    )
    expect(() => parseCronExpression('3-1 * * * * *')).toThrow(
      new Error('Failed to parse 3-1: Invalid range (start: 3, end: 1).')
    )
    expect(() => parseCronExpression('4-60 * * * * *')).toThrow(
      new Error(
        'Failed to parse 4-60: 60 is outside of constraint range of 0 - 59.'
      )
    )
    expect(() => parseCronExpression('* * * 0-10 * *')).toThrow(
      new Error(
        'Failed to parse 0-10: 0 is outside of constraint range of 1 - 31.'
      )
    )
  })
})
