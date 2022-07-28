/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
		
const [ SuccessMessagesEnum ] = require('../../contants');

const router = express.Router();

const { ListCategoriesEnum, GroceryList, HardwareList, OnlineList, ShoppingList } = require('../../models/ShoppingList/shoppingList.model');

router.get('/', async(req, res) => {
	console.log('Getting all shopping lists...')
	try {
		const shoppingLists = await ShoppingList.find();
		res.status(200).json({
			status: 200,
			message: SuccessMessagesEnum.SHOPPING_LISTS_FETCHED,
			data: shoppingLists,
		})
	} catch (error) {
		console.error(error)	
	}finally{
		console.log('GET: /shoppingLists/ completed...')
	}
})

router.post('/', async(req, res) => {
	console.log('Creating a new shopping list...');
	const { store, items, category } = req.body;
	try {
		let newList; 
		switch (category) {
			case ListCategoriesEnum.GROCERY:
				newList = new GroceryList({
					_id: mongoose.Types.ObjectId(),
					store,
					items,
				})
				break;
			case ListCategoriesEnum.HARDWARE:
				newList = new HardwareList({
					_id: mongoose.Types.ObjectId(),
					store,
					items
				})
				break;
				case ListCategoriesEnum.ONLINE:
					newList = new OnlineList({
						_id: mongoose.Types.ObjectId(),
						store,
						items
					})
					break;
			default:
				throw('Non-known list category provided.');
		}
		await newList.save();

		res.status(200).json({
			status: 200,
			message: SuccessMessagesEnum.NEW_LIST_ADDED,
		})
	} catch (error) {
		console.error(error)
	}finally{
		console.log('POST: /shoppingList/ completed...')
	}
})

router.patch('/', async(req,res) => {
	console.log('Updating shopping list...')
	const { _id, item } = req.body;
	try {
		const targetList = await ShoppingList.findById(_id)
		// console.log(targetList.items)
		console.log(item)
		targetList.items.push(item);
		await targetList.save();

		res.status(200).json({
			status: 200,
			message: SuccessMessagesEnum.SHOPPING_LIST_UPDATED,
		})
	} catch (error) {
		console.error(error)
	}finally{
		console.log('Updating shopping list completed...')
	}

})

module.exports = router;