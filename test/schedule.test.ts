import { Schedule } from '../src/schedule'

describe('constructor', () => {
  const scheduleDefinition = {
    seconds: [23, 10, 17],
    minutes: [5, 4, 2],
    hours: [0, 1],
    days: [12],
    months: [7, 3],
    weekdays: [6, 3],
  }
  const schedule = new Schedule(scheduleDefinition)

  test('should clone schedule definition', () => {
    expect(scheduleDefinition).not.toBe(schedule.prev)
    expect(scheduleDefinition).not.toBe(schedule.next)
    expect(schedule.next).not.toBe(schedule.prev)

    expect(new Set(scheduleDefinition.seconds)).toEqual(
      new Set(schedule.next.seconds)
    )
    expect(new Set(scheduleDefinition.minutes)).toEqual(
      new Set(schedule.next.minutes)
    )
    expect(new Set(scheduleDefinition.hours)).toEqual(
      new Set(schedule.next.hours)
    )
    expect(new Set(scheduleDefinition.days)).toEqual(
      new Set(schedule.next.days)
    )
    expect(new Set(scheduleDefinition.months)).toEqual(
      new Set(schedule.next.months)
    )
    expect(new Set(scheduleDefinition.weekdays)).toEqual(
      new Set(schedule.next.weekdays)
    )

    expect(new Set(schedule.next.seconds)).toEqual(
      new Set(schedule.prev.seconds)
    )
    expect(new Set(schedule.next.minutes)).toEqual(
      new Set(schedule.prev.minutes)
    )
    expect(new Set(schedule.next.hours)).toEqual(new Set(schedule.prev.hours))
    expect(new Set(schedule.next.days)).toEqual(new Set(schedule.prev.days))
    expect(new Set(schedule.next.months)).toEqual(new Set(schedule.prev.months))
    expect(new Set(schedule.next.weekdays)).toEqual(
      new Set(schedule.prev.weekdays)
    )
  })

  test('next should be sorted in ascending order', () => {
    expect(schedule.next.seconds).toStrictEqual([10, 17, 23])
    expect(schedule.next.minutes).toStrictEqual([2, 4, 5])
    expect(schedule.next.hours).toStrictEqual([0, 1])
    expect(schedule.next.days).toStrictEqual([12])
    expect(schedule.next.months).toStrictEqual([3, 7])
    expect(schedule.next.weekdays).toStrictEqual([3, 6])
  })

  test('prev should be sorted in descending order', () => {
    expect(schedule.prev.seconds).toStrictEqual([23, 17, 10])
    expect(schedule.prev.minutes).toStrictEqual([5, 4, 2])
    expect(schedule.prev.hours).toStrictEqual([1, 0])
    expect(schedule.prev.days).toStrictEqual([12])
    expect(schedule.prev.months).toStrictEqual([7, 3])
    expect(schedule.prev.weekdays).toStrictEqual([6, 3])
  })
})

describe('getNextDate', () => {
  // TODO
})

describe('getNextDates', () => {
  // TODO
})

describe('getPrevDate', () => {
  // TODO
})

describe('getPrevDates', () => {
  // TODO
})

describe('matchDate', () => {
  test('Should return true for a matching date', () => {
    const schedule1 = new Schedule({
      seconds: [],
      minutes: [],
      hours: [],
      days: [],
      months: [],
      weekdays: [],
    })
    expect(schedule1.matchDate(new Date())).toBeTruthy()

    const schedule2 = new Schedule({
      seconds: [47, 48, 49],
      minutes: [37],
      hours: [0, 1],
      days: [12],
      months: [2, 3],
      weekdays: [1],
    })
    expect(schedule2.matchDate(new Date(2001, 2, 12, 0, 37, 48))).toBeTruthy()
  })

  test('Should return false for a non matching date', () => {
    const schedule1 = new Schedule({
      seconds: [47, 48, 49],
      minutes: [37],
      hours: [0, 1],
      days: [12],
      months: [2, 3],
      weekdays: [1],
    })
    expect(schedule1.matchDate(new Date(2001, 1, 12, 0, 37, 48))).toBeFalsy()
    expect(schedule1.matchDate(new Date(2001, 2, 13, 0, 37, 48))).toBeFalsy()
    expect(schedule1.matchDate(new Date(2001, 2, 12, 2, 37, 48))).toBeFalsy()
    expect(schedule1.matchDate(new Date(2001, 2, 12, 0, 38, 48))).toBeFalsy()
    expect(schedule1.matchDate(new Date(2001, 2, 12, 0, 37, 50))).toBeFalsy()
  })
})

describe('setTimeout', () => {
  // TODO
})

describe('setInterval', () => {
  // TODO
})

describe('clearTimeoutOrInterval', () => {
  // TODO
})