import { ObjectId } from 'mongodb'

import { asyncLocalStorage } from '../../services/als.service.js'
import { logger } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const orderService = {
	query,
	getById,
	remove,
	add,
	update,
}

async function query(filterBy = {}) {
// async function query() {
	try {
        const criteria = _buildCriteria(filterBy)

		const collection = await dbService.getCollection('order')
		var orderCursor = await collection.find(criteria)
		// const orderCursor = await collection.find({}) 

		const orders = await orderCursor.toArray() 
		return orders
	} catch (err) {
		logger.error('cannot find orders', err)
		throw err
	}
}


async function getById(orderId) {
	try {
        const criteria = { _id: ObjectId.createFromHexString(orderId) }

		const collection = await dbService.getCollection('order')
		const order = await collection.findOne(criteria)
		// order.createdAt = order._id.getTimestamp()
		return order
	} catch (err) {
		logger.error(`while finding order ${orderId}`, err)
		throw err
	}
}

async function remove(orderId) {
    // const { loggedinUser } = asyncLocalStorage.getStore()
    // const { _id: hostId, isAdmin } = loggedinUser

	try {
        const criteria = { 
            _id: ObjectId.createFromHexString(orderId), 
        }
        // if(!isAdmin) criteria['host._id'] = hostId
        
		const collection = await dbService.getCollection('order')
		const res = await collection.deleteOne(criteria)

        if(res.deletedCount === 0) throw('Not your order')
		return orderId
	} catch (err) {
		logger.error(`cannot remove order ${orderId}`, err)
		throw err
	}
}

async function add(order) {
	try {
		const collection = await dbService.getCollection('order')
		await collection.insertOne(order)

		return order
	} catch (err) {
		logger.error('cannot insert order', err)
		throw err
	}
}

async function update(order) {
    const orderToSave = {
		status: order.status
    }

    try {
        const criteria = { _id: ObjectId.createFromHexString(order._id) }

		const collection = await dbService.getCollection('order')
		await collection.updateOne(criteria, { $set: orderToSave })

		return order
	} catch (err) {
		logger.error(`cannot update order ${order._id}`, err)
		throw err
	}
}

function _buildCriteria(filterBy) {
    const criteria = {}

    if (filterBy.guestId) {
        criteria['guest._id'] = filterBy.guestId
    }

    if (filterBy.hostId) {
        criteria['host._id'] = filterBy.hostId
    }

    return criteria
}

