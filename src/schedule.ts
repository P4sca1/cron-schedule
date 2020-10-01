import { extractDateElements, ITimerHandle, longTimeout } from './utils'

/**
 * An object with contains for each element of a date, which values are allowed.
 * When an array is empty, it means that all values are allowed for that element.
 */
export interface IScheduleDefinition {
  readonly seconds: ReadonlyArray<number>
  readonly minutes: ReadonlyArray<number>
  readonly hours: ReadonlyArray<number>
  readonly days: ReadonlyArray<number>
  readonly months: ReadonlyArray<number>
  readonly weekdays: ReadonlyArray<number>
}

export class Schedule {
  // readonly #prev: IScheduleDefinition
  readonly #next: IScheduleDefinition

  public constructor({
    seconds,
    minutes,
    hours,
    days,
    months,
    weekdays,
  }: IScheduleDefinition) {
    // Clone the schedule definition and sort all values in descending order.
    // Used to lookup previous schedules.
    // this.#prev = {
    //   seconds: seconds.map((x) => x).sort((a, b) => a + b),
    //   minutes: minutes.map((x) => x).sort((a, b) => a + b),
    //   hours: hours.map((x) => x).sort((a, b) => a + b),
    //   days: days.map((x) => x).sort((a, b) => a + b),
    //   months: months.map((x) => x).sort((a, b) => a + b),
    //   weekdays: weekdays.map((x) => x).sort((a, b) => a + b),
    // }

    // Clone the schedule definition and sort all values in ascending order.
    // Used to lookup next schedules.
    this.#next = {
      seconds: seconds.map((x) => x).sort((a, b) => a - b),
      minutes: minutes.map((x) => x).sort((a, b) => a - b),
      hours: hours.map((x) => x).sort((a, b) => a - b),
      days: days.map((x) => x).sort((a, b) => a - b),
      months: months.map((x) => x).sort((a, b) => a - b),
      weekdays: weekdays.map((x) => x).sort((a, b) => a - b),
    }
  }

  /** Gets the next scheduled date starting from the given start date or now. */
  // TODO: getNextDate and getPrevDate algorithms will work very similar. So we should combine logic into
  // one function calcDate and pass a prev or next argument. This function should then be called in getNextDate and getPrevDate.
  public getNextDate(startDate: Date = new Date()): Date {
    const {
      second: startSecond,
      minute: startMinute,
      hour: startHour,
      day: startDay,
      month: startMonth,
      // weekday: startWeekday,
      year: startYear,
    } = extractDateElements(startDate)

    const {
      seconds: allowedSeconds,
      minutes: allowedMinutes,
      hours: allowedHours,
      days: allowedDays,
      months: allowedMonths,
      // weekdays: allowedWeekdays,
    } = this.#next

    const nextDate = new Date(
      startYear,
      startMonth,
      startDay,
      startHour,
      startMinute,
      startSecond
    )

    // 1: Find an allowed month that is greater or equal than the current month.
    if (allowedMonths.length > 0) {
      const nextMonth =
        allowedMonths.find((x) => x >= startMonth) ?? allowedMonths[0]

      if (nextMonth !== startMonth) {
        nextDate.setMonth(nextMonth)
        nextDate.setDate(allowedDays[0])
        nextDate.setHours(allowedHours[0])
        nextDate.setMinutes(allowedMinutes[0])
        nextDate.setSeconds(allowedSeconds[0])
      }

      // When the next month is behind the start month, the date belongs to the next year.
      if (nextMonth < startMonth) {
        nextDate.setFullYear(startYear + 1)
      }
    }

    // 2: Find an allowed date that is greater or equal than the current date.
    // TODO: Does not check for weekday yet.
    if (allowedDays.length > 0) {
      const nextDay = allowedDays.find((x) => x >= startDay) ?? allowedDays[0]

      if (nextDay !== startDay) {
        nextDate.setDate(nextDay)
        nextDate.setHours(allowedHours[0])
        nextDate.setMinutes(allowedMinutes[0])
        nextDate.setSeconds(allowedSeconds[0])
      }
    }

    // 3: Find an allowed hour that is greater or equal than the current hour.
    if (allowedHours.length > 0) {
      const nextHour =
        allowedHours.find((x) => x >= startDay) ?? allowedHours[0]

      if (nextHour !== startHour) {
        nextDate.setHours(nextHour)
        nextDate.setMinutes(allowedMinutes[0])
        nextDate.setSeconds(allowedSeconds[0])
      }
    }

    // 4: Find an allowed minute that is greater or equal than the current minute.
    if (allowedMinutes.length > 0) {
      const nextMinute =
        allowedMinutes.find((x) => x >= startMinute) ?? allowedMinutes[0]

      if (nextMinute !== startMinute) {
        nextDate.setMinutes(allowedMinutes[0])
        nextDate.setSeconds(allowedSeconds[0])
      }
    }

    // 5: Find an allowed second that is greater than the current second.
    // TODO: Algorithm is bad! second might jump from 59 to 0 and other elements stay the same
    // so that the next date is in the past.
    if (allowedSeconds.length > 0) {
      const nextSecond =
        allowedSeconds.find((x) => x >= startSecond) ?? allowedSeconds[0]

      if (nextSecond !== startSecond) {
        nextDate.setSeconds(allowedSeconds[0])
      } else {
        nextDate.setSeconds((startSecond + 1) % 60)
      }
    } else {
      nextDate.setSeconds((startSecond + 1) % 60)
    }

    return nextDate
  }

  /** Gets the specified amount of future scheduled dates starting from the given start date or now. */
  public getNextDates(amount: number, startDate?: Date): Date[] {
    const dates = []
    let nextDate

    for (let i = 0; i < amount; i++) {
      nextDate = this.getNextDate(nextDate ?? startDate)
      dates.push(nextDate)
    }

    return dates
  }

  /** Gets the previously scheduled date starting from the given start date or now. */
  public getPrevDate(startDate: Date = new Date()): Date {
    // TODO
    return new Date()
  }

  /** Gets the specified amount of previously scheduled dates starting from the given start date or now. */
  public getPrevDates(amount: number, startDate?: Date): Date[] {
    const dates = []
    let prevDate

    for (let i = 0; i < amount; i++) {
      prevDate = this.getPrevDate(prevDate ?? startDate)
      dates.push(prevDate)
    }

    return dates
  }

  /** Returns true when there is a schedule at the given date. */
  public matchDate(date: Date): boolean {
    const { second, minute, hour, day, month, weekday } = extractDateElements(
      date
    )

    const {
      seconds: allowedSeconds,
      minutes: allowedMinutes,
      hours: allowedHours,
      days: allowedDays,
      months: allowedMonths,
      weekdays: allowedWeekdays,
    } = this.#next

    return (
      (allowedSeconds.length === 0 || allowedSeconds.indexOf(second) !== -1) &&
      (allowedMinutes.length === 0 || allowedMinutes.indexOf(minute) !== -1) &&
      (allowedHours.length === 0 || allowedHours.indexOf(hour) !== -1) &&
      (allowedDays.length === 0 || allowedDays.indexOf(day) !== -1) &&
      (allowedMonths.length === 0 || allowedMonths.indexOf(month) !== -1) &&
      (allowedWeekdays.length === 0 || allowedWeekdays.indexOf(weekday) !== -1)
    )
  }

  /**
   * Creates a timeout, which will fire the given function on the next schedule.
   * Returns a handle which can be used to clear the timeout using clearTimeoutOrInterval.
   */
  public setTimeout(fn: () => void): ITimerHandle {
    const nextSchedule = this.getNextDate()
    const timeout = nextSchedule.getTime() - Date.now()

    return longTimeout(fn, timeout)
  }

  /**
   * Creates an interval, which will fire the given function on every future schedule.
   * Returns a handle which can be used to clear the interval using clearTimeoutOrInterval.
   * The handle parameter can be ignored. It is used internally to keep the timeoutId
   * in the handle up to date.
   */
  public setInterval(fn: () => void, handle?: ITimerHandle): ITimerHandle {
    handle ??= { timeoutId: undefined }

    const { timeoutId } = this.setTimeout(() => {
      fn()
      this.setInterval(fn, handle)
    })

    handle.timeoutId = timeoutId

    return handle
  }

  /** Clears a timeout or interval, making sure that the function will no longer execute. */
  public clearTimeoutOrInterval(handle: ITimerHandle): void {
    if (handle.timeoutId) {
      clearTimeout(handle.timeoutId)
    }
  }
}
