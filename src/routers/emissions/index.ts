import { Router } from 'express'

import MeasureAPI from '@/services/measure/api'
import { logger } from '@/logger'
import { validateQuery } from '../../middleware/validation'
import { emissionsDayQuerySchema } from '../../validators/emissions.schema'

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
    //add error logging here and the other 3 requests
    logger.error(
      { error, domain, date },
      'Measure API failed for /emissions/day'
    )

    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/week', async (req, res) => {
  const { domain, date } = req.query as { domain: string; date: string }

  // TODO - Implement the logic to sum `totalEmissions` for the given domain's emissions for the week
  // the date is the start of the week
  res.json({
    domain,
    dates: [],
    totalEmissions: 0,
    high: { value: 0, date: '' },
    low: { value: 0, date: '' },
  })
})

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
