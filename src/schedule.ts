export class Schedule {
  public readonly minutes: number[]
  public readonly hours: number[]
  public readonly days: number[]
  public readonly months: number[]
  public readonly weekdays: number[]

  #timerHandles: number[] = []

  public constructor(
    minutes: number[],
    hours: number[],
    days: number[],
    months: number[],
    weekdays: number[]
  ) {
    this.minutes = minutes
    this.hours = hours
    this.days = days
    this.months = months
    this.weekdays = weekdays
  }

  /** Gets the next scheduled date starting from the given start date or now. */
  public getNextDate(startDate: Date = new Date()): Date {
    // TODO
    return new Date()
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
   * Returns a handle which can be used with clearTimeout.
   */
  public setTimeout(fn: () => void): number {
    const nextSchedule = this.getNextDate()
    return setTimeout(fn, nextSchedule.getTime() - Date.now())
  }

  /**
   * Creates an interval, which will fire the given function on every future schedule.
   * Returns a handle which can be used to clear the interval.
   */
  public setInterval(fn: () => void, handle?: number): number {
    handle ??= this.#timerHandles.length++

    const nextSchedule = this.getNextDate()

    this.#timerHandles[handle] = setTimeout(() => {
      fn()
      this.setInterval(fn, handle)
    }, nextSchedule.getTime() - Date.now())

    return handle
  }

  /** Clears the interval, making sure that the function will no longer execute on future schedules. */
  public clearInterval(handle: number): void {
    clearTimeout(this.#timerHandles[handle])
  }
}
