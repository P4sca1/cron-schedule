import { ITimerHandle, longTimeout } from './utils'

export class Schedule {
  public readonly seconds: number[]
  public readonly minutes: number[]
  public readonly hours: number[]
  public readonly days: number[]
  public readonly months: number[]
  public readonly weekdays: number[]

  public constructor(
    seconds: number[],
    minutes: number[],
    hours: number[],
    days: number[],
    months: number[],
    weekdays: number[]
  ) {
    this.seconds = seconds
    this.minutes = minutes
    this.hours = hours
    this.days = days
    this.months = months
    this.weekdays = weekdays
  }

  /** Gets the next scheduled date starting from the given start date or now. */
  public getNextDate(startDate: Date = new Date()): Date {
    // TODO
    return new Date(startDate.getTime() + 5000)
  }

  /** Gets the specified amount of future scheduled dates starting from the given start date or now. */
  public getNextDates(amount: number, startDate: Date = new Date()): Date[] {
    if (amount <= 0) throw new Error('amount needs to be at least 0.')
    // TODO
    return []
  }

  /** Gets the previously scheduled date starting from the given start date or now. */
  public getPrevDate(startDate: Date = new Date()): Date {
    // TODO
    return new Date()
  }

  /** Gets the specified amount of previously scheduled dates starting from the given start date or now. */
  public getPrevDates(amount: number, startDate: Date = new Date()): Date[] {
    if (amount <= 0) throw new Error('amount needs to be at least 0.')
    // TODO
    return []
  }

  /** Returns true when there is a schedule at the given date. */
  public matchDate(date: Date): boolean {
    // TODO
    return false
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
    handle ??= { timeoutId: -1 }

    const { timeoutId } = this.setTimeout(() => {
      fn()
      this.setInterval(fn, handle)
    })

    handle.timeoutId = timeoutId

    return handle
  }

  /** Clears a timeout or interval, making sure that the function will no longer execute. */
  public clearTimeoutOrInterval(handle: ITimerHandle): void {
    clearTimeout(handle.timeoutId)
  }
}
