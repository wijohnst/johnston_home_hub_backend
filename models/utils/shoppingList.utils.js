const mongoose = require('mongoose');
const { Store } = require('../ShoppingList/store.model');

async function addNewStoresMiddleware(store) {
	const { category, items } = store;
	const stores = Array.from(new Set(items.map(item => item.store)));
	const dbStores = await Store.find();
	const dbStoreNames = Array.from(new Set(dbStores.map(store => store._id)));

	stores.forEach(async function (store) {
		if(dbStoreNames.includes(store)){
			return;
		}else{
			console.log(`Creating new store : ${store}`)
			const newStore = new Store({
				_id: mongoose.Types.ObjectId(),
				name: store,
				category
			})

			await newStore.save();
		}
	})
}

module.exports.addNewStoresMiddleware = addNewStoresMiddleware;