import { z } from 'zod'
import { isNotFutureDate } from '../utils/date'

export const dayDateSchema = z.iso.date().superRefine((date, ctx) => {
  if (!isNotFutureDate(date)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Date cannot be today or in the future',
      params: { httpStatus: 422 },
    })
  }
})
