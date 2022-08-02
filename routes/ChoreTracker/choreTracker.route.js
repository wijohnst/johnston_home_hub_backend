const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const { HTTPMessagesEnum } = require('../../constants');

const { Chore }  = require('../../models/Chore/chore')

// eslint-disable-next-line no-unused-vars
router.get('/', async(_req, res) => {
	console.log('Fetching chore data from `chores/`...');
	try{
		const chores = await Chore.find();
		res.status(200).json({
			status: 200,
			message: HTTPMessagesEnum.CHORE_DATA_FETCHED,
			data: chores,
		})
	}catch(error){
		console.error(error);
	}finally{
		console.log('Fetch chores is complete...')
	}

})

// eslint-disable-next-line no-unused-vars
router.post('/', async(req, res) => {
	console.log('Posting a new chore...');
	const { name, intervalDays, lastCompleted } = req.body; 	
	try{
		const newChore = new Chore({
			_id: mongoose.Types.ObjectId(),
			name,
			intervalDays: parseInt(intervalDays),
			lastCompleted: lastCompleted !== undefined ? new Date(lastCompleted) : Date.now(),
		});
		await newChore.save();
		res.status(200).json({
			status: 200,
			message: HTTPMessagesEnum.NEW_CHORE_ADDED,
		});
	}catch(error){
		console.error(error)
	}finally{
		console.log('POST: /chores/ completed...')
	}
})

// eslint-disable-next-line no-unused-vars
router.patch('/', async(req, res) => {
	console.log('Updating chore completion date...')
	const { choreId } = req.body;
	try {
		const targetChore = await Chore.findOneAndUpdate({_id: choreId}, {lastCompleted : new Date()});
		await targetChore.save();
		res.status(200).json({
			status: 200,
			message: HTTPMessagesEnum.CHORE_UPDATED,
		})
	} catch (error) {
		console.error(error)
	}finally{
		console.log('PATCH: /chores/ completed...')
	}
})

module.exports = router;