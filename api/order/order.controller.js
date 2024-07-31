import { logger } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'
import { userService } from '../user/user.service.js'
import { authService } from '../auth/auth.service.js'
import { orderService } from './order.service.js'

export async function getOrders(req, res) {
	try {
		const filterBy = {
			guestId: req.query.guestId || '',
			hostId: req.query.hostId || ''
		}

		const orders = await orderService.query(filterBy)
		// const orders = await orderService.query()
		res.json(orders)
	} catch (err) {
		logger.error('Cannot get orders', err)
		res.status(400).send({ err: 'Failed to get orders' })
	}
}

export async function getOrderById(req, res) {
	try {
		const orderId = req.params.id
		const order = await orderService.getById(orderId)
		res.json(order)
	} catch (err) {
		logger.error('Failed to get order', err)
		res.status(400).send({ err: 'Failed to get order' })
	}
}

export async function addOrder(req, res) {
	// const { loggedinUser } = req

	try {
		var order = req.body
		order = await orderService.add(order)
		socketService.emitToUser({ type: 'order-added', data: order, userId: order.host._id })

		res.send(order)
	} catch (err) {
		logger.error('Failed to add order', err)
		res.status(400).send({ err: 'Failed to add order' })
	}
}

export async function updateOrder(req, res) {

	try {
		var order = req.body
		order = await orderService.update(order)
		socketService.emitToUser({ type: 'order-updated', data: order, userId: order.guest._id })
		res.send(order)
	} catch (err) {
		logger.error('Failed to update order', err)
		res.status(400).send({ err: 'Failed to update order' })
	}
}

export async function removeOrder(req, res) {
	try {
		const orderId = req.params.id
		const removedId = await orderService.remove(orderId)

		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove order', err)
		res.status(400).send({ err: 'Failed to remove order' })
	}
}