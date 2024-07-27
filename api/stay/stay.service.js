import { ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

// const PAGE_SIZE = 3

export const stayService = {
	remove,
	query,
	getById,
	add,
	update,
	// addStayMsg,
	// removeStayMsg,
}

// async function query(filterBy = { txt: '' }) {
	async function query() {
	try {
		// const criteria = _buildCriteria(filterBy)
		// const sort = _buildSort(filterBy)

		const collection = await dbService.getCollection('stay')
		// var stayCursor = await collection.find(criteria)
		const stayCursor = await collection.find({}) 
		// var stayCursor = await collection.find(criteria, { sort })

		// if (filterBy.pageIdx !== undefined) {
		// 	stayCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
		// }

		const stays = await stayCursor.toArray() //
		// const stays = stayCursor.toArray()
		return stays
	} catch (err) {
		logger.error('cannot find stays', err)
		throw err
	}
}


async function getById(stayId) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(stayId) }

		const collection = await dbService.getCollection('stay')
		const stay = await collection.findOne(criteria)
		// stay.createdAt = stay._id.getTimestamp()
		return stay
	} catch (err) {
		logger.error(`while finding stay ${stayId}`, err)
		throw err
	}
}

async function remove(stayId) {
	// const { loggedinUser } = asyncLocalStorage.getStore()
	// const { _id: hostId, isAdmin } = loggedinUser

	try {
		const criteria = {
			_id: ObjectId.createFromHexString(stayId),
		}
		// if(!isAdmin) criteria['host._id'] = hostId

		const collection = await dbService.getCollection('stay')
		const res = await collection.deleteOne(criteria)

		if (res.deletedCount === 0) throw ('Not your stay')
		return stayId
	} catch (err) {
		logger.error(`cannot remove stay ${stayId}`, err)
		throw err
	}
}

async function add(stay) {
	try {
		const collection = await dbService.getCollection('stay')
		await collection.insertOne(stay)

		return stay
	} catch (err) {
		logger.error('cannot insert stay', err)
		throw err
	}
}

async function update(stay) {
	const stayToSave = {
		// _id: stay._id,
		// name: stay.name,
		// type: stay.type,
		// imgUrls: stay.imgUrls,
		price: stay.price,
		// summary: stay.summary,
		capacity: stay.capacity,
		// amenities: stay.amenities,
		// labels: stay.labels,
		// host: stay.host,
		// loc: stay.loc
	}

	try {
		const criteria = { _id: ObjectId.createFromHexString(stay._id) }

		const collection = await dbService.getCollection('stay')
		await collection.updateOne(criteria, { $set: stayToSave })

		return stay
	} catch (err) {
		logger.error(`cannot update stay ${stay._id}`, err)
		throw err
	}
}

// async function addStayMsg(stayId, msg) {
// 	try {
//         const criteria = { _id: ObjectId.createFromHexString(stayId) }
//         msg.id = makeId()

// 		const collection = await dbService.getCollection('stay')
// 		await collection.updateOne(criteria, { $push: { msgs: msg } })

// 		return msg
// 	} catch (err) {
// 		logger.error(`cannot add stay msg ${stayId}`, err)
// 		throw err
// 	}
// }

// async function removeStayMsg(stayId, msgId) {
// 	try {
//         const criteria = { _id: ObjectId.createFromHexString(stayId) }

// 		const collection = await dbService.getCollection('stay')
// 		await collection.updateOne(criteria, { $pull: { msgs: { id: msgId }}})

// 		return msgId
// 	} catch (err) {
// 		logger.error(`cannot add stay msg ${stayId}`, err)
// 		throw err
// 	}
// }



function _buildCriteria(filterBy) {
	const { txt, label, guest } = filterBy
	const criteria = {};

	if (txt) {
		criteria.$or = [
			{ 'loc.country': { $regex: txt, $options: 'i' } },
			{ 'loc.city': { $regex: txt, $options: 'i' } },
			{ name: { $regex: txt, $options: 'i' } }
		];
	}

	if (label) {
		criteria.labels = { $in: [label] }
	}

	if (guest) {
		criteria.capacity = { $gte: guest.capacity }
	}

	return criteria
}

// function _buildSort(filterBy) {
//     if(!filterBy.sortField) return {}
//     return { [filterBy.sortField]: filterBy.sortDir }
// }