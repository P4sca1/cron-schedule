import type { Cron } from '../cron.js'
import { ITimerHandle, longTimeout, wrapFunction } from '../utils.js'

/**
 * A cron scheduler that is based on timers.
 * It will create one timer for every scheduled cron.
 * When the node timeout limit of ~24 days would be exceeded,
 * it uses multiple consecutive timeouts.
 */
export class TimerBasedCronScheduler {
  /**
   * Creates a timeout, which will fire the given task on the next cron date.
   * Returns a handle which can be used to clear the timeout using clearTimeoutOrInterval.
   */
  public static setTimeout(
    cron: Cron,
    task: () => unknown,
    opts?: { errorHandler?: (err: unknown) => unknown }
  ): ITimerHandle {
    const nextSchedule = cron.getNextDate()
    const timeout = nextSchedule.getTime() - Date.now()

    return longTimeout(wrapFunction(task, opts?.errorHandler), timeout)
  }

  /**
   * Creates an interval, which will fire the given task on every future cron date.
   * Returns a handle which can be used to clear the interval using clearTimeoutOrInterval.
   */
  public static setInterval(
    cron: Cron,
    task: () => unknown,
    opts?: { errorHandler?: (err: unknown) => unknown; handle?: ITimerHandle }
  ): ITimerHandle {
    const handle = opts?.handle ?? { timeoutId: undefined }

    const { timeoutId } = this.setTimeout(cron, () => {
      wrapFunction(task, opts?.errorHandler)()
      this.setInterval(cron, task, { ...opts, handle })
    })

    handle.timeoutId = timeoutId

    return handle
  }

  /** Clears a timeout or interval, making sure that the function will no longer execute. */
  public static clearTimeoutOrInterval(handle: ITimerHandle): void {
    if (handle.timeoutId) {
      clearTimeout(handle.timeoutId)
    }
  }
}
