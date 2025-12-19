import { Router } from 'express'

import MeasureAPI from '@/services/measure/api'
import { logger } from '@/logger'
import { validateQuery } from '../../middleware/validation'
import { emissionsWeekQuerySchema } from '../../validators/emissions.schema'
import { weekDatesFromDate } from '../../utils/date'
import { formatEmissionsData } from '../../services/emissions/formatter'

const router = Router({ mergeParams: true, strict: true })
router.get(
  '/week',
  validateQuery(emissionsWeekQuerySchema),
  async (req, res) => {
    const { date, domain } = res.locals.query as {
      date: string
      domain: string
    }

    const dates = weekDatesFromDate(date)

    try {
      const results = await Promise.all(
        dates.map(async (d) => {
          const r = await MeasureAPI.measure([domain], d)
          return { value: r.totalEmissions ?? 0, date }
        })
      )

      const { totalEmissions, high, low, average } =
        formatEmissionsData(results)

      res.json({
        domain,
        dates,
        totalEmissions,
        high,
        low,
        average,
      })
    } catch (error) {
      logger.error(
        { error, domain, date },
        'Measure API failed for /emissions/week'
      )

      res.status(500).json({ error: 'Internal server error' })
    }
  }
)
export default router
