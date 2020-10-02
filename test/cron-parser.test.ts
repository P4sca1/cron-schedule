import { parseCronExpression } from '../src/cron-parser'
import { Schedule } from '../src/schedule'

describe('parseCronExpression', () => {
  test('Should parse a cron expression into a schedule instance', () => {
    expect(parseCronExpression('* * * * * *')).toBeInstanceOf(Schedule)
  })

  test('Should parse asterix to all allowed values', () => {
    expect(parseCronExpression('* * * * * *')).toEqual({
      seconds: Array.from({ length: 60 }, (_, i) => i),
      minutes: Array.from({ length: 60 }, (_, i) => i),
      hours: Array.from({ length: 24 }, (_, i) => i),
      days: Array.from({ length: 31 }, (_, i) => i + 1),
      months: Array.from({ length: 12 }, (_, i) => i),
      weekdays: Array.from({ length: 7 }, (_, i) => i),
    })
  })

  test('Should correctly parse single numbers', () => {
    expect(parseCronExpression('1 2 3 4 5 6')).toEqual({
      seconds: [1],
      minutes: [2],
      hours: [3],
      days: [4],
      months: [4],
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
    } = parseCronExpression('1,2 2,3,4 4,5,6 7,8 9,10,11 0,1,2')

    expect(seconds).toStrictEqual([1, 2])
    expect(minutes).toStrictEqual([2, 3, 4])
    expect(hours).toStrictEqual([4, 5, 6])
    expect(days).toStrictEqual([7, 8])
    expect(months).toStrictEqual([8, 9, 10])
    expect(weekdays).toStrictEqual([0, 1, 2])
  })

  test('Should correctly parse ranges', () => {
    const {
      seconds,
      minutes,
      hours,
      days,
      months,
      weekdays,
    } = parseCronExpression('1-3 2-6 3-22 4-10 5-11 0-6')

    expect(seconds).toStrictEqual([1, 2, 3])
    expect(minutes).toStrictEqual([2, 3, 4, 5, 6])
    expect(hours).toStrictEqual([
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
    ])
    expect(days).toStrictEqual([4, 5, 6, 7, 8, 9, 10])
    expect(months).toStrictEqual([4, 5, 6, 7, 8, 9, 10])
    expect(weekdays).toStrictEqual([0, 1, 2, 3, 4, 5, 6])
  })

  test('Should correctly parse ranges in lists', () => {
    const {
      seconds,
      minutes,
      hours,
      days,
      months,
      weekdays,
    } = parseCronExpression('1-3,7,9-11 2,3,2-6 1,3-22,2 2,3,4-10 1,5-11 0-6,7')

    expect(seconds).toStrictEqual([1, 2, 3, 7, 9, 10, 11])
    expect(minutes).toStrictEqual([2, 3, 4, 5, 6])
    expect(hours).toStrictEqual([
      1,
      2,
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
    ])
    expect(days).toStrictEqual([2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(months).toStrictEqual([0, 4, 5, 6, 7, 8, 9, 10])
    expect(weekdays).toStrictEqual([0, 1, 2, 3, 4, 5, 6])
  })

  test('Should correctly parse step values', () => {
    const {
      seconds,
      minutes,
      hours,
      days,
      months,
      weekdays,
    } = parseCronExpression('*/10 2-10/3 0-9/2 5-11/4 */2 0-6/3')

    expect(seconds).toStrictEqual([0, 10, 20, 30, 40, 50])
    expect(minutes).toStrictEqual([2, 5, 8])
    expect(hours).toStrictEqual([0, 2, 4, 6, 8])
    expect(days).toStrictEqual([5, 9])
    expect(months).toStrictEqual([0, 2, 4, 6, 8, 10])
    expect(weekdays).toStrictEqual([0, 3, 6])
  })

  test('Should correctly parse month names', () => {
    expect(parseCronExpression('0 0 0 1 jan 0')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [0],
      weekdays: [0],
    })

    expect(parseCronExpression('0 0 0 1 feb 0')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [1],
      weekdays: [0],
    })

    expect(parseCronExpression('0 0 0 1 MAR 0')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [2],
      weekdays: [0],
    })

    expect(parseCronExpression('0 0 0 1 ApR 0')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [3],
      weekdays: [0],
    })

    expect(parseCronExpression('0 0 0 1 maY 0')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [4],
      weekdays: [0],
    })

    expect(parseCronExpression('0 0 0 1 jun 0')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [5],
      weekdays: [0],
    })

    expect(parseCronExpression('0 0 0 1 jul 0')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [6],
      weekdays: [0],
    })

    expect(parseCronExpression('0 0 0 1 aug 0')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [7],
      weekdays: [0],
    })

    expect(parseCronExpression('0 0 0 1 sep 0')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [8],
      weekdays: [0],
    })

    expect(parseCronExpression('0 0 0 1 oct 0')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [9],
      weekdays: [0],
    })

    expect(parseCronExpression('0 0 0 1 nov 0')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [10],
      weekdays: [0],
    })

    expect(parseCronExpression('0 0 0 1 dec 0')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [11],
      weekdays: [0],
    })

    expect(parseCronExpression('0 0 0 1 jan,nov 0')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [0, 10],
      weekdays: [0],
    })

    expect(parseCronExpression('0 0 0 1 jun-sep 0')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [5, 6, 7, 8],
      weekdays: [0],
    })
  })

  test('Should correctly parse weekday names', () => {
    expect(parseCronExpression('0 0 0 1 1 sun')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [0],
      weekdays: [0],
    })

    expect(parseCronExpression('0 0 0 1 1 Mon')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [0],
      weekdays: [1],
    })

    expect(parseCronExpression('0 0 0 1 1 Tue')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [0],
      weekdays: [2],
    })

    expect(parseCronExpression('0 0 0 1 1 WeD')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [0],
      weekdays: [3],
    })

    expect(parseCronExpression('0 0 0 1 1 THU')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [0],
      weekdays: [4],
    })

    expect(parseCronExpression('0 0 0 1 1 fri')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [0],
      weekdays: [5],
    })

    expect(parseCronExpression('0 0 0 1 1 sat')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [0],
      weekdays: [6],
    })

    expect(parseCronExpression('0 0 0 1 1 mon,tue')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [0],
      weekdays: [1, 2],
    })

    expect(parseCronExpression('0 0 0 1 1 thu-sat')).toEqual({
      seconds: [0],
      minutes: [0],
      hours: [0],
      days: [1],
      months: [0],
      weekdays: [4, 5, 6],
    })
  })

  test('Should default to 0 when no seconds are specified in the cron expression', () => {
    expect(parseCronExpression('5 0 * * *').seconds).toStrictEqual([0])
    expect(parseCronExpression('15 14 1 * *').seconds).toStrictEqual([0])
    expect(parseCronExpression('23 0-23/2 * * *').seconds).toStrictEqual([0])
  })

  test('Should parse both 0 and 7 for weekday as sunday', () => {
    expect(parseCronExpression('* * * * * 0').weekdays).toEqual([0])
    expect(parseCronExpression('* * * * * 7').weekdays).toEqual([0])
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

  test('Should throw error on invalid cron string', () => {
    expect(() => parseCronExpression('')).toThrow(
      new TypeError('Invalid cron expression: expected 5 or 6 elements.')
    )
    // @ts-expect-error -- test without argument
    expect(() => parseCronExpression()).toThrow(
      new TypeError('Invalid cron expression: must be of type string.')
    )
    // @ts-expect-error -- test with number argument
    expect(() => parseCronExpression(0)).toThrow(
      new TypeError('Invalid cron expression: must be of type string.')
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
