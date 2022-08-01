/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
		
const { SuccessMessagesEnum, ListCategoriesEnum } = require('../../constants');

const router = express.Router();

const { GroceryList, HardwareList, OnlineList, ShoppingList, Store } = require('../../models/ShoppingList/shoppingList.model');

const { Item ,GroceryItem, OnlineItem } = require('../../models/ShoppingList/item.model');

const { Aisle } = require('../../models/ShoppingList/aisle.model');

const { addNewStore, getItemInfo, getNewShoppingListByCategory, getNewItemByCategory } = require('./shoppingList.route.utils');

router.get('/', async (req, res) => {
	console.log('Getting all shopping lists...')
	try {
		const shoppingLists = await ShoppingList.find().populate(
				{
					path: 'items', populate : [
						{ path: 'store', model: 'Store'}, 
						{ path: 'aisle', model: 'Aisle', strictPopulate: false},
					],
				},
			).exec(function (error, shoppingLists){
			if(error){
				console.error('Error from populate method chain :', error)
			}else{				
				res.status(200).json({
					status: 200,
					message: SuccessMessagesEnum.SHOPPING_LISTS_FETCHED,
					shoppingLists,
				})
			}
		});
		
	} catch (error) {
		console.error(error)	
	}finally{
		console.log('GET: /shoppingLists/ completed...')
	}
})

router.post('/', async(req, res) => {
	console.log('Creating a new shopping list...');
	const { items, category } = req.body;
	try {
		const newList = getNewShoppingListByCategory (category);

		await newList.save(function(err, list) {
			if (err) return console.error(err); 

			if(category === ListCategoriesEnum.GROCERY){
				items.forEach(item => {
					const { isItemInDb, hasDbStore, hasDbAisle } = getItemInfo(item);

					const newStoreId = !hasDbStore ? mongoose.Types.ObjectId() : null;
					const newAisleId = !hasDbAisle ? mongoose.Types.ObjectId() : null;

					if(!isItemInDb){
						console.log('Creating new Grocery Item...')

						const newGroceryItem = new GroceryItem({
							_id: item._id ?? mongoose.Types.ObjectId(),
							name: item.name,
							store: item.store._id ?? newStoreId,
							aisle: item.aisle._id ?? newAisleId,
							quantity: item.quantity,
						})

						if(!hasDbStore){
							addNewStore(newStoreId, item.store.name, category);
						}

						if(!hasDbAisle){
							console.log('Creating new Aisle from new List...');
							const newAisle = new Aisle({
								_id: newAisleId,
								aisle: item.aisle.aisle,
							})
							newAisle.save();
						}
						
						newGroceryItem.save(function (err){
							err && console.error(err);
						})
						
						list.items.push(newGroceryItem._id);
					}else{
						console.log('Item exists in DB...');
						if(!hasDbStore){
							addNewStore(newStoreId, item.store.name, item.store.category);
						}
						list.items.push(item._id);
					}
					list.save();
				})
			}else if(category === ListCategoriesEnum.ONLINE){
				items.forEach(item => {
					const { isItemInDb, hasDbStore } = getItemInfo(item);

					const newStoreId = !hasDbStore ? mongoose.Types.ObjectId() : null;
					
					if(!isItemInDb){
						console.log('Creating new Online Item...')
						
						const newOnlineItem = new OnlineItem({
							_id: mongoose.Types.ObjectId(),
							name: item.name,
							store: item.store._id ?? newStoreId,
							quantity: item.quantity,
							url: item.url,
					});

					if(!hasDbStore){
						addNewStore(newStoreId, item.store.name, category);
					}
	
					newOnlineItem.save(function (err){
						err && console.log(err);
					})
	
					list.items.push(newOnlineItem._id);
					}else{
						console.log('Item exists in DB...');	
						if(!hasDbStore){
							addNewStore(newStoreId, item.store.name, item.store.category);
						}
						list.items.push(item._id);
					}
				list.save();
			})
		}else{
			items.forEach(item => {
				const { isItemInDb, hasDbStore } = getItemInfo(item);

				const newStoreId = !hasDbStore ? mongoose.Types.ObjectId() : null;

				if(!isItemInDb){
					console.log('Creating new Item...')
					const newItem = new Item({
						_id: mongoose.Types.ObjectId(),
						name: item.name,
						store: item.store._id,
						quantity: item.quantity,
						category
					});

					if(!hasDbStore){
						addNewStore(newStoreId, item.store.name, item.store.category)
					}

					newItem.save(function (err){
						err && console.log(err);
					})

					list.items.push(newItem._id);
				}else{
					console.log('Item exists in DB...');
					if(!hasDbStore){
						addNewStore(newStoreId, item.store.name, item.store.category)
					}	
					list.items.push(item._id);
				}
			})
		}
	});

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
	const { _shoppingListId, item } = req.body;
	const { isItemInDb } = getItemInfo(item);
	
	const newDbItem = getNewItemByCategory(item.category, item);

	if(!isItemInDb){
		await newDbItem.save();
	}

	try {
		const targetList = await ShoppingList.findById(_shoppingListId)
		targetList.items.push(item._id ?? newDbItem._id);
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