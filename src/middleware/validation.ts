import { z } from 'zod'
import type { Request, Response, NextFunction, RequestHandler } from 'express'

export const validateQuery =
  (schema: z.ZodTypeAny): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)

    if (result.success) {
      res.locals.query = result.data as unknown
      return next()
    }

    const issue = result.error.issues[0]
    const statusCode =
      (issue as z.core.$ZodIssueCustom)?.params?.httpStatus ?? 400
    const errorMessage =
      statusCode === 422 ? 'Unprocessable Entity' : 'Bad Request'
    const message = issue?.message

    return res.status(statusCode).json({
      error: errorMessage,
      code: statusCode,
      message,
    })
  }
