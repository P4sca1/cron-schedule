import { parseCronExpression } from './cron-parser'
import { Schedule } from './schedule'

describe('parseCronExpression', () => {
  test('should correctly parse a cron expression into a schedule instance', () => {
    const schedule = parseCronExpression('* * * * * *')
    expect(schedule).toBeInstanceOf(Schedule)
    expect(schedule).toStrictEqual(new Schedule({
      seconds: [], minutes: [], hours: [], days: [], months: [], weekdays: []
    }))
  })
})