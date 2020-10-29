import type { Cron } from '../cron'

interface ITaskWrapper {
  id: number
  cron: Cron
  nextExecution: Date
  isOneTimeTask: boolean
  task: () => unknown
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

  /* Starts the scheduler and returns the id of the created nterval. */
  public start(): ReturnType<typeof setInterval> {
    if (this.#intervalId !== undefined) {
      throw new Error('Scheduler already started.')
    }

    this.#intervalId = setInterval(this.processTasks.bind(this), this.#interval)

    return this.#intervalId
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
    isOneTimeTask = false
  ): number {
    const id = this.#nextTaskId

    this.insertTask({
      id,
      cron,
      nextExecution: cron.getNextDate(),
      isOneTimeTask,
      task,
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
      const task = this.#tasks[i]

      if (task.nextExecution.getTime() <= now) {
        task.task()
        taskExecuted = true

        if (!task.isOneTimeTask) {
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

    if (taskExecuted) {
      // Sort tasks based on nextExecution again.
      this.sortTasks()
    }
  }
}
