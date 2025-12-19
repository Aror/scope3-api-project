import { z } from 'zod'
import { domainSchema } from './domain.schema'
import { dayDateSchema } from './date.schema'

export const emissionsDayQuerySchema = z.object({
  domain: domainSchema,
  date: dayDateSchema,
})
