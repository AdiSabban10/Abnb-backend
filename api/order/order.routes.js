import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { getOrders, getOrderById, removeOrder, addOrder, updateOrder } from './order.controller.js'

const router = express.Router()

// router.get('/', getOrders)
// router.get('/:id', getOrderById)
// router.delete('/:id', removeOrder)
// router.post('/', addOrder)
// router.put('/:id', updateOrder)

router.get('/', log, getOrders)
router.get('/:id', log, getOrderById)
router.post('/',  log, requireAuth, addOrder)
router.delete('/:id',  requireAuth, removeOrder)
router.put('/:id', requireAuth, updateOrder)

export const orderRoutes = router