import { extractDateElements, ITimerHandle, longTimeout } from './utils'

/**
 * An object with contains for each element of a date, which values are allowed.
 * Everything starting at 0, except for days.
 */
export interface IScheduleDefinition {
  readonly seconds: Set<number>
  readonly minutes: Set<number>
  readonly hours: Set<number>
  readonly days: Set<number>
  readonly months: Set<number>
  readonly weekdays: Set<number>
}

export class Schedule {
  // Everything starting at 0, except for days.
  public readonly seconds: ReadonlyArray<number>
  public readonly minutes: ReadonlyArray<number>
  public readonly hours: ReadonlyArray<number>
  public readonly days: ReadonlyArray<number>
  public readonly months: ReadonlyArray<number>
  public readonly weekdays: ReadonlyArray<number>

  public readonly reversed: {
    seconds: ReadonlyArray<number>
    minutes: ReadonlyArray<number>
    hours: ReadonlyArray<number>
    days: ReadonlyArray<number>
    months: ReadonlyArray<number>
    weekdays: ReadonlyArray<number>
  }

  public constructor({
    seconds,
    minutes,
    hours,
    days,
    months,
    weekdays,
  }: IScheduleDefinition) {
    // Validate that there are values provided.
    if (!seconds || seconds.size === 0)
      throw new Error('There must be at least one allowed second.')
    if (!minutes || minutes.size === 0)
      throw new Error('There must be at least one allowed minute.')
    if (!hours || hours.size === 0)
      throw new Error('There must be at least one allowed hour.')
    if (!months || months.size === 0)
      throw new Error('There must be at least one allowed month.')
    if ((!weekdays || weekdays.size === 0) && (!days || days.size === 0))
      throw new Error('There must be at least one allowed day or weekday.')

    // Convert set to array and sort in ascending order.
    this.seconds = Array.from(seconds).sort((a, b) => a - b)
    this.minutes = Array.from(minutes).sort((a, b) => a - b)
    this.hours = Array.from(hours).sort((a, b) => a - b)
    this.days = Array.from(days).sort((a, b) => a - b)
    this.months = Array.from(months).sort((a, b) => a - b)
    this.weekdays = Array.from(weekdays).sort((a, b) => a - b)

    // Validate that all values are integers within the constraint.
    const validateDate = (
      name: string,
      data: ReadonlyArray<number>,
      constraint: { min: number; max: number }
    ) => {
      if (
        data.some(
          (x) =>
            typeof x !== 'number' ||
            x % 1 !== 0 ||
            x < constraint.min ||
            x > constraint.max
        )
      ) {
        throw new Error(
          `${name} must only consist of integers which are within the range of ${constraint.min} and ${constraint.max}`
        )
      }
    }

    validateDate('seconds', this.seconds, { min: 0, max: 59 })
    validateDate('minutes', this.minutes, { min: 0, max: 59 })
    validateDate('hours', this.hours, { min: 0, max: 23 })
    validateDate('days', this.days, { min: 1, max: 31 })
    validateDate('months', this.months, { min: 0, max: 11 })
    validateDate('weekdays', this.weekdays, { min: 0, max: 6 })

    // For each element, store a reversed copy in the reversed attribute for finding prev dates.
    this.reversed = {
      seconds: this.seconds.map((x) => x).reverse(),
      minutes: this.minutes.map((x) => x).reverse(),
      hours: this.hours.map((x) => x).reverse(),
      days: this.days.map((x) => x).reverse(),
      months: this.months.map((x) => x).reverse(),
      weekdays: this.weekdays.map((x) => x).reverse(),
    }
  }

  /** Gets the next scheduled date starting from the given start date or now. */
  public getNextDate(startDate: Date = new Date()): Date {
    const startDateElements = extractDateElements(startDate)

    const nextDate = new Date(
      startDateElements.year,
      startDateElements.month,
      startDateElements.day,
      startDateElements.hour,
      startDateElements.minute,
      startDateElements.second
    )

    // Find next allowed element -> if next allowed element is less than start value
    // add it to the max allowed value and the Date instance rolles over automatically
    // e.g. 60 seconds -> +1 minute and set second to 0.
    nextDate.setSeconds(
      this.seconds.find((x) => x > nextDate.getSeconds()) ??
        60 + this.seconds[0]
    )

    nextDate.setMinutes(
      this.minutes.find((x) => x >= nextDate.getMinutes()) ??
        60 + this.minutes[0]
    )

    nextDate.setHours(
      this.hours.find((x) => x >= nextDate.getHours()) ?? 24 + this.hours[0]
    )

    // See if next day of month or day of week is next to start date
    // Get date of next matching weekday and then compare the abs differences of those to the startDate
    // const nextDateByDay =
    //   this.days.find((x) => x >= nextDate.getDate()) ??
    //   new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate() +
    //     this.days[0]

    // const nextWeekday =
    //   this.days.find((x) => x >= nextDate.getDay()) ?? this.days[0]

    // const daysToAddByWeekday = Math.abs(nextWeekday - nextDate.getDay())

    // TODO: Store in var new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()

    // IF DAYS IS NOT EMPTY
    // TODO: Find day which is >= current day AND <= days of current month
    //       When nothing is found:
    //       1. Get next day with this.days[0]
    //       2. Find next month which has the desired amount of days. ATTENTION: NEEDS TO CONFORM WITH limited months
    // => We have the date with fits the days property

    // IF WEEKDAYS IS NOT EMPTY
    // Find next weekday
    // const nextWeekday =
    //   this.days.find((x) => x >= nextDate.getDay()) ?? this.days[0]

    // const daysToAddByWeekday = Math.abs(nextWeekday - nextDate.getDay())

    // AFTER CALCULATING NEXT DATE
    // ONLY DAYS IS SET: Use date from days calculatiton
    // ONLY WEEKDAYS IS SET: Use date from weekday calculation
    // BOTH ARE SET: Use date that is closer to next date
    nextDate.setDate(
      this.days.find((x) => x >= nextDate.getDate()) ??
        new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate() +
          this.days[0]
    )

    nextDate.setMonth(
      this.months.find((x) => x >= nextDate.getMonth()) ?? 12 + this.months[0]
    )

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
    const startDateElements = extractDateElements(startDate)

    const prevDate = new Date(
      startDateElements.year,
      startDateElements.month,
      startDateElements.day,
      startDateElements.hour,
      startDateElements.minute,
      startDateElements.second
    )

    // Find prev allowed element -> if prev allowed element is greater than start value
    // substract the difference between the allowed value and the min value and the Date instance rolles over automatically
    // e.g. -1 seconds -> -1 minute and set second to 59.
    prevDate.setSeconds(
      this.reversed.seconds.find((x) => x < prevDate.getSeconds()) ??
        -(60 - this.reversed.seconds[0])
    )

    prevDate.setMinutes(
      this.reversed.minutes.find((x) => x <= prevDate.getMinutes()) ??
        -(60 - this.reversed.minutes[0])
    )

    prevDate.setHours(
      this.reversed.hours.find((x) => x <= prevDate.getHours()) ??
        -(24 - this.reversed.hours[0])
    )

    prevDate.setDate(
      this.reversed.days.find((x) => x <= prevDate.getDate()) ??
        -(
          new Date(prevDate.getFullYear(), prevDate.getMonth(), 0).getDate() -
          this.reversed.days[0]
        )
    )

    prevDate.setMonth(
      this.reversed.months.find((x) => x <= prevDate.getMonth()) ??
        -(12 - this.reversed.months[0])
    )

    return prevDate
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

    return (
      this.seconds.indexOf(second) !== -1 &&
      this.minutes.indexOf(minute) !== -1 &&
      this.hours.indexOf(hour) !== -1 &&
      this.months.indexOf(month) !== -1 &&
      (this.days.indexOf(day) !== -1 || this.weekdays.indexOf(weekday) !== -1)
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
