import { Router } from 'express'

import MeasureAPI from '@/services/measure/api'
import { logger } from '@/logger'
import { validateQuery } from '../../middleware/validation'
import { emissionsMonthQuerySchema } from '../../validators/emissions.schema'
import { monthDatesFromMonth } from '../../utils/date'
import { formatEmissionsData } from '../../services/emissions/formatter'

const router = Router({ mergeParams: true, strict: true })

router.get(
  '/month',
  validateQuery(emissionsMonthQuerySchema),
  async (req, res) => {
    const { domain, date } = req.query as {
      domain: string
      date: string
    }

    const dates = monthDatesFromMonth(date)

    try {
      const response = await Promise.allSettled(
        dates.map(async (d) => {
          try {
            const r = await MeasureAPI.measure([domain], d)
            return { value: r.totalEmissions ?? 0, date: d }
          } catch (err) {
            logger.error(
              { err, domain, date: d },
              'MeasureAPI failed for route /month'
            )
            throw err
          }
        })
      )

      const results = response
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value)

      const { totalEmissions, high, low, average } =
        formatEmissionsData(results)

      res.json({
        domain,
        month: date,
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
