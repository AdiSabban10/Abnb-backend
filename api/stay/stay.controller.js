import { logger } from '../../services/logger.service.js';
import { stayService } from './stay.service.js';

export async function getStays(req, res) {
	try {
		const filterBy = {
			txt: req.query.txt || '',
			label: req.query.label || '',
			guest: +req.query.guest || 0,
			type: req.query.type || '',
			minPrice: +req.query.minPrice || 0,
			maxPrice: +req.query.maxPrice || Infinity,
		};
		const page = +req.query.page || 0;
		const paginate = req.query.paginate !== 'false'; // default is true

		logger.debug('Getting Stays', filterBy, paginate);
		const stays = await stayService.query(filterBy, page, paginate);

		res.json(stays);
	} catch (err) {
		logger.error('Failed to get stays', err);
		res.status(400).send({ err: 'Failed to get stays' });
	}
}

export async function getStayById(req, res) {
	try {
		const stayId = req.params.id;
		const stay = await stayService.getById(stayId);
		res.json(stay);
	} catch (err) {
		logger.error('Failed to get stay', err);
		res.status(400).send({ err: 'Failed to get stay' });
	}
}

export async function addStay(req, res) {
	const { loggedinUser, body: stay } = req;

	try {
		stay.host = loggedinUser;
		const addedStay = await stayService.add(stay);
		res.json(addedStay);
	} catch (err) {
		logger.error('Failed to add stay', err);
		res.status(400).send({ err: 'Failed to add stay' });
	}
}

export async function updateStay(req, res) {
	const stay = req.body;

	try {
		const updatedStay = await stayService.update(stay);
		res.json(updatedStay);
	} catch (err) {
		logger.error('Failed to update stay', err);
		res.status(400).send({ err: 'Failed to update stay' });
	}
}

export async function removeStay(req, res) {
	try {
		const stayId = req.params.id;
		const removedId = await stayService.remove(stayId);
		res.send(removedId);
	} catch (err) {
		logger.error('Failed to remove stay', err);
		res.status(400).send({ err: 'Failed to remove stay' });
	}
}

export async function countStays(req, res) {
	try {
		const filterBy = {
			txt: req.query.txt || '',
			label: req.query.label || '',
			guest: +req.query.guest || 0,
			type: req.query.type || '',
			minPrice: +req.query.minPrice || 0,
			maxPrice: +req.query.maxPrice || Infinity,
		};

		logger.debug('Counting Stays', filterBy);
		const count = await stayService.countStays(filterBy);

		res.json({ count });
	} catch (err) {
		logger.error('Failed to count stays', err);
		res.status(400).send({ err: 'Failed to count stays' });
	}
}
