/*
	utility functions for the shoppingList router

*/

const { Store } = require('../../models/ShoppingList/store.model');

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

module.exports.addNewStore = addNewStore;
module.exports.getItemInfo = getItemInfo;