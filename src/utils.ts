const TIMEOUT_MAX = 2147483647 // 2^31-1

export interface ITimerHandle {
  timeoutId: number
}

/**
 * Creates a new timeout, which can exceed the max timeout limit of 2^31-1.
 * Since multiple timeouts are used internally, the timeoutId used to clear the timeout
 * is returned as a handle (object) and changes whenever the max timeout limit is exceeded.
 * The handle parameter can be ignored, it is used internally for updating the timeoutId
 * in the handle after creating the next timeout.
 */
export function longTimeout(
  fn: () => void,
  timeout: number,
  handle?: ITimerHandle
): ITimerHandle {
  let after = 0

  if (timeout > TIMEOUT_MAX) {
    after = timeout - TIMEOUT_MAX
    timeout = TIMEOUT_MAX
  }

  handle ??= {
    timeoutId: -1,
  }

  handle.timeoutId = setTimeout(() => {
    if (after > 0) {
      longTimeout(fn, after, handle)
    } else {
      fn()
    }
  }, timeout)

  return handle
}
