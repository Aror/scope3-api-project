import { Router } from 'express'

import dayRouter from './day'
import weekRouter from './week'
import monthRouter from './month'

const router = Router({ mergeParams: true, strict: true })

router.use(dayRouter)
router.use(weekRouter)
router.use(monthRouter)

export default router
