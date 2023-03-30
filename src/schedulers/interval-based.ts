import type { Cron } from '../cron.js'
import { wrapFunction } from '../utils.js'

interface ITaskWrapper {
  id: number
  cron: Cron
  nextExecution: Date
  task: () => unknown
  isOneTimeTask: boolean
  errorHandler?: (err: unknown) => unknown
}

/**
 * A cron scheduler that is based on a single interval.
 * Every interval, it checks whether a registered cron task
 * was due during the last interval and executes it.
 * This scheduler might be more performant depending on the use case,
 * because it only creates a single interval for all scheduled crons,
 * however depending on the interval and crons, tasks might be executed
 * with a delay.
 */
export class IntervalBasedCronScheduler {
  #interval: number
  #intervalId?: ReturnType<typeof setInterval>
  #tasks: ITaskWrapper[] = []
  #nextTaskId = 1

  /**
   * Creates and starts a new scheduler with the given interval.
   */
  public constructor(interval: number) {
    this.#interval = interval
    this.start()
  }

  /* Starts the scheduler. */
  public start(): void {
    if (this.#intervalId !== undefined) {
      throw new Error('Scheduler already started.')
    }

    this.#intervalId = setInterval(this.processTasks.bind(this), this.#interval)
  }

  /* Ensures the scheduler is stopped. */
  public stop(): void {
    if (this.#intervalId) {
      clearInterval(this.#intervalId)
      this.#intervalId = undefined
    }
  }

  /* Inserts a task in the tasks array at the right position sorted by nextExecution time. */
  private insertTask(newTask: ITaskWrapper) {
    const index = this.#tasks.findIndex(
      (task) => task.nextExecution.getTime() > newTask.nextExecution.getTime()
    )

    this.#tasks.splice(index, 0, newTask)
  }

  /* Registers a new task. */
  public registerTask(
    cron: Cron,
    task: () => unknown,
    opts?: {
      isOneTimeTask: boolean
      errorHandler?: (err: unknown) => unknown
    }
  ): number {
    const id = this.#nextTaskId

    this.insertTask({
      id,
      cron,
      nextExecution: cron.getNextDate(),
      task,
      isOneTimeTask: opts?.isOneTimeTask ?? false,
      errorHandler: opts?.errorHandler,
    })

    this.#nextTaskId += 1
    return id
  }

  /** Unregisters a task, causing it to no longer be executed. */
  public unregisterTask(id: number): void {
    const taskIndex = this.#tasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) throw new Error('Task not found.')
    this.#tasks.splice(taskIndex, 1)
  }

  /* Sorts the tasks array based on the next execution time so that the next task is first in the array. */
  private sortTasks(): void {
    this.#tasks.sort((a, b) => {
      return a.nextExecution.getTime() - b.nextExecution.getTime()
    })
  }

  private processTasks(): void {
    const now = Date.now()
    let taskExecuted = false
    let oneTimeTaskExecuted = false

    // Execute all due tasks and update nextExecution for non-one-time tasks.
    for (let i = 0; i < this.#tasks.length; i += 1) {
      const task = this.#tasks[i] // eslint-disable-line security/detect-object-injection

      if (task.nextExecution.getTime() <= now) {
        wrapFunction(task.task, task.errorHandler)()

        if (!task.isOneTimeTask) {
          taskExecuted = true
          task.nextExecution = task.cron.getNextDate()
        } else {
          oneTimeTaskExecuted = true
        }
      } else {
        break
      }
    }

    if (oneTimeTaskExecuted) {
      // Remove one time tasks.
      this.#tasks = this.#tasks.filter(
        (task) => task.nextExecution.getTime() > now
      )
    }

    // When at least one nextExecution time got updated (at least one non-one-time-task ran),
    // we need to resort the tasks based on nextExecution.
    if (taskExecuted) {
      this.sortTasks()
    }
  }
}
