/*
	utility functions for the shoppingList router

*/

const mongoose = require('mongoose');

const { Store } = require('../../models/ShoppingList/store.model');
const { GroceryList, OnlineList, HardwareList, GroceryItem, Item, OnlineItem } = require('../../models/ShoppingList/shoppingList.model');

const { ListCategoriesEnum } = require('../../constants');

/**
 * Creates a new Store document
 * 
 * @param {Schema.ObjectId} newStoreId 
 * @param {string} storeName 
 * @param {string} category - optional
 */
const addNewStore = async (newStoreId, storeName, category) => {
	console.log('Creating new Store...');

	const newStore = new Store({
		_id: newStoreId,
		name: storeName,
		category: category,
	})

	await newStore.save((error) => {
		error && console.error(error);
	});
	
	console.log(`${storeName} Store created successfully.`)
}

/**
 * Returns conditional information for a given Item	
 *
 * @param {Item | GroceryItem | OnlineItem } item 
 * @returns {{
 * 	isItemInDb : boolean,
 * 	hasDbStore : boolean,
 * 	hasDbAisle : boolean,
 * }}
 */
const getItemInfo = (item) => {
	const isItemInDb = !!item._id;
	const hasDbStore = item.store._id !== undefined && item.store._id !== null && item.store._id !== '';
	const hasDbAisle = !!item?.aisle?._id;

	return {
		isItemInDb,
		hasDbStore,
		hasDbAisle,
	}
}

/**
 * Accepts a category string and returns a ShoppingList discremenated by category
 * 
 * @param {String} category 
 * @returns {GroceryList | HardwareList | OnlineList | void }
 */
const getNewShoppingListByCategory = (category) => {
	let newList;
			switch (category) {
			case ListCategoriesEnum.GROCERY:
				newList = new GroceryList({
					_id: mongoose.Types.ObjectId(),
					category: ListCategoriesEnum.GROCERY,
				})
				break;
			case ListCategoriesEnum.HARDWARE:
				newList = new HardwareList({
					_id: mongoose.Types.ObjectId(),
					category: ListCategoriesEnum.HARDWARE,
				})
				break;
				case ListCategoriesEnum.ONLINE:
					newList = new OnlineList({
						_id: mongoose.Types.ObjectId(),
						category: ListCategoriesEnum.ONLINE,
					})
					break;
			default:
				throw('Non-known list category provided.');
		}

		return newList;
}

const getNewItemByCategory = (category, item) => {
	let newItem;
	switch (category) {
		case ListCategoriesEnum.GROCERY:
			newItem = new GroceryItem({
				_id: mongoose.Types.ObjectId(),
				name: item.name,
				store: item.store._id,
				aisle: item.aisle._id,
				quantity: item.quantity,
				category, 
			});
			break;
		case ListCategoriesEnum.HARDWARE:
			newItem = new Item({
				_id: mongoose.Types.ObjectId(),
				name: item.name,
				store: item.store._id,
				quantity: item.quantity,
				category,
			});
			break;
		case ListCategoriesEnum.Online:
			newItem = new OnlineItem({
				_id: mongoose.Types.ObjectId(),
				name: item.name,
				store: item.store._id,
				url: item.url,
				category,
			});
			break;
		default:
			throw('Unknow list category provided')
	}

	return newItem;
}

module.exports.addNewStore = addNewStore;
module.exports.getItemInfo = getItemInfo;
module.exports.getNewListByCategory = getNewShoppingListByCategory;
module.exports.getNewItemByCategory = getNewItemByCategory;