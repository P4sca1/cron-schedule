import { Cron } from './cron'

interface IConstraint {
  min: number
  max: number
  aliases?: Record<string, string>
}

const secondConstraint: IConstraint = {
  min: 0,
  max: 59,
}

const minuteConstraint: IConstraint = {
  min: 0,
  max: 59,
}

const hourConstraint: IConstraint = {
  min: 0,
  max: 23,
}

const dayConstraint: IConstraint = {
  min: 1,
  max: 31,
}

const monthConstraint: IConstraint = {
  min: 1,
  max: 12,
  aliases: {
    jan: '1',
    feb: '2',
    mar: '3',
    apr: '4',
    may: '5',
    jun: '6',
    jul: '7',
    aug: '8',
    sep: '9',
    oct: '10',
    nov: '11',
    dec: '12',
  },
}

const weekdayConstraint: IConstraint = {
  min: 0,
  max: 7,
  aliases: {
    'sun': '0',
    'mon': '1',
    'tue': '2',
    'wed': '3',
    'thu': '4',
    'fri': '5',
    'sat': '6',
  },
}

const timeNicknames: Record<string, string | undefined> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 1 *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@hourly': '0 * * * *',
  '@minutely': '* * * * *',
}

function parseElement(element: string, constraint: IConstraint): Set<number> {
  const result = new Set<number>()

  // If returned set of numbers is empty, the scheduler class interpretes the emtpy set of numbers as all valid values of the constraint
  if (element === '*') {
    for (let i = constraint.min; i <= constraint.max; i = i + 1) {
      result.add(i)
    }

    return result
  }

  // If the element is a list, parse each element in the list.
  const listElements = element.split(',')
  if (listElements.length > 1) {
    listElements.forEach((listElement) => {
      const parsedListElement = parseElement(listElement, constraint)
      parsedListElement.forEach((x) => result.add(x))
    })

    return result
  }

  // Helper function to parse a single element, which includes checking for alias, valid number and constraint min and max.
  const parseSingleElement = (singleElement: string): number => {
    singleElement =
      constraint.aliases?.[singleElement.toLowerCase()] ?? singleElement
    const parsedElement = parseInt(singleElement, 10)

    if (Number.isNaN(parsedElement)) {
      throw new Error(`Failed to parse ${element}: ${singleElement} is NaN.`)
    }

    if (parsedElement < constraint.min || parsedElement > constraint.max) {
      throw new Error(
        `Failed to parse ${element}: ${singleElement} is outside of constraint range of ${constraint.min} - ${constraint.max}.`
      )
    }

    return parsedElement
  }

  // Detect if the element is a range.
  /* eslint-disable security/detect-unsafe-regex */
  const rangeSegments =
    /^((([0-9a-zA-Z]+)-([0-9a-zA-Z]+))|\*)(\/([0-9]+))?$/.exec(element)
  /* eslint-enable security/detect-unsafe-regex */

  // If not, it must be a single element.
  if (rangeSegments === null) {
    result.add(parseSingleElement(element))
    return result
  }

  // If it is a range, get start and end of the range.
  const parsedStart =
    rangeSegments[1] === '*'
      ? constraint.min
      : parseSingleElement(rangeSegments[3])

  const parsedEnd =
    rangeSegments[1] === '*'
      ? constraint.max
      : parseSingleElement(rangeSegments[4])

  if (parsedStart > parsedEnd) {
    throw new Error(
      `Failed to parse ${element}: Invalid range (start: ${parsedStart}, end: ${parsedEnd}).`
    )
  }

  // Check whether there is a custom step defined for the range, defaulting to 1.
  const step = rangeSegments[6] as string | undefined
  let parsedStep = 1

  if (step !== undefined) {
    parsedStep = parseInt(step, 10)
    if (Number.isNaN(parsedStep)) {
      throw new Error(`Failed to parse step: ${step} is NaN.`)
    } else if (parsedStep < 1) {
      throw new Error(
        `Failed to parse step: Expected ${step} to be greater than 0.`
      )
    }
  }

  // Go from start to end of the range by the given steps.
  for (let i = parsedStart; i <= parsedEnd; i = i + parsedStep) {
    result.add(i)
  }

  return result
}

/** Parses a cron expression into a Cron instance. */
export function parseCronExpression(cronExpression: string): Cron {
  if (typeof cronExpression !== 'string') {
    throw new TypeError('Invalid cron expression: must be of type string.')
  }

  // Convert time nicknames.
  cronExpression = timeNicknames[cronExpression.toLowerCase()] ?? cronExpression

  const elements = cronExpression.split(' ')
  if (elements.length < 5 || elements.length > 6) {
    throw new Error('Invalid cron expression: expected 5 or 6 elements.')
  }

  const rawSeconds = elements.length === 6 ? elements[0] : '0'
  const rawMinutes = elements.length === 6 ? elements[1] : elements[0]
  const rawHours = elements.length === 6 ? elements[2] : elements[1]
  const rawDays = elements.length === 6 ? elements[3] : elements[2]
  const rawMonths = elements.length === 6 ? elements[4] : elements[3]
  const rawWeekdays = elements.length === 6 ? elements[5] : elements[4]

  return new Cron({
    seconds: parseElement(rawSeconds, secondConstraint),
    minutes: parseElement(rawMinutes, minuteConstraint),
    hours: parseElement(rawHours, hourConstraint),
    days: parseElement(rawDays, dayConstraint),
    // months in cron are indexed by 1, but Cron expects indexes by 0, so we need to reduce all set values by one.
    months: new Set(
      Array.from(parseElement(rawMonths, monthConstraint)).map((x) => x - 1)
    ),
    weekdays: new Set(
      Array.from(parseElement(rawWeekdays, weekdayConstraint)).map((x) => x % 7)
    ),
  })
}
