import { z } from 'zod'
import { isNotFutureDate, monthIncludesFutureDates } from '../utils/date'

export const dayDateSchema = z.iso.date().superRefine((date, ctx) => {
  if (!isNotFutureDate(date)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Date cannot be today or in the future',
      params: { httpStatus: 422 },
    })
  }
})

export const monthSchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, 'Invalid month format (YYYY-MM)')
  .superRefine((month, ctx) => {
    if (monthIncludesFutureDates(month)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Month includes future dates',
        params: { httpStatus: 422 },
      })
    }
  })
