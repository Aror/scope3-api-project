import { Router } from 'express'

import MeasureAPI from '@/services/measure/api'
import { logger } from '@/logger'
import { validateQuery } from '../../middleware/validation'
import {
  emissionsDayQuerySchema,
  emissionsWeekQuerySchema,
} from '../../validators/emissions.schema'
import { weekDatesFromDate } from '../../utils/date'

const router = Router({ mergeParams: true, strict: true })

router.get('/day', validateQuery(emissionsDayQuerySchema), async (req, res) => {
  const { date, domain } = res.locals.query as { date: string; domain: string }

  logger.info({ domain, date }, 'Received /day request')

  try {
    const response = await MeasureAPI.measure([domain], date)

    const totalEmissions = response.totalEmissions ?? 0

    // Avoiding 404 here: this endpoint computes emissions metrics on demand.
    // Lack of upstream data is a valid outcome, not a missing resource.
    res.json({ totalEmissions, domain, date })
  } catch (error) {
    logger.error(
      { error, domain, date },
      'Measure API failed for /emissions/day'
    )

    res.status(500).json({ error: 'Internal server error' })
  }
})

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

      const totalEmissions = results.reduce((prev, current) => {
        return prev + current.value
      }, 0)

      const high = results.reduce(
        (prev, current) => {
          return current.value > prev.value
            ? { value: current.value, date: current.date }
            : prev
        },
        { value: results[0]?.value || 0, date: results[0]?.date }
      )

      const low = results.reduce(
        (prev, current) => {
          return current.value < prev.value
            ? { value: current.value, date: current.date }
            : prev
        },
        { value: results[0]?.value || 0, date: results[0]?.date }
      )

      res.json({
        domain,
        dates,
        totalEmissions,
        high,
        low,
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

router.get('/month', async (req, res) => {
  const { domain, date: month } = req.query as {
    domain: string
    date: string
  }
  // TODO - Implement the logic to sum `totalEmissions` for the given domain's emissions for the month
  // the date is the start of the month
  res.json({ domain, month })
})

export default router
