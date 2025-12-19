import { z } from 'zod'
import { domainSchema } from './domain.schema'
import { dayDateSchema, monthSchema } from './date.schema'

export const emissionsDayQuerySchema = z.object({
  domain: domainSchema,
  date: dayDateSchema,
})

export const emissionsWeekQuerySchema = z.object({
  domain: domainSchema,
  date: dayDateSchema,
})

export const emissionsMonthQuerySchema = z.object({
  domain: domainSchema,
  date: monthSchema,
})
