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
	const { loggedinUser, body: order } = req

	try {
		order.guest = loggedinUser
		const addedOrder = await orderService.add(order)
		res.json(addedOrder)
	} catch (err) {
		logger.error('Failed to add order', err)
		res.status(400).send({ err: 'Failed to add order' })
	}
}

export async function updateOrder(req, res) {
	// const { loggedinUser, body: order } = req
	const order = req.body
    // const { _id: userId, isAdmin } = loggedinUser

    // if(!isAdmin && order.host._id !== userId) {
    //     res.status(403).send('Not your order...')
    //     return
    // }

	try {
		const updatedOrder = await orderService.update(order)
		res.json(updatedOrder)
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