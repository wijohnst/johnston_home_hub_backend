/*
	Model file for the ShoppingList Data Type
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { Store } = require('../ShoppingList/ store.model');

const ListCategoriesEnum = Object.freeze({
	GROCERY : "Grocery",
	HARDWARE: "Hardware",
	ONLINE : "Online",
});

const options = { discriminatorKey: 'category'};

const ShoppingListSchema = new Schema({
	_id: Schema.ObjectId,
}, options)

const GroceryItem = new Schema({
	_id: Schema.ObjectId,
	name: { type: String, required: true},
	store: { type: String },
	aisle: { type: String, deafult: "Miscelaneous"},
	quantity: { type: String, default: "?"},
})

const HardwareItem = new Schema({
	_id: Schema.ObjectId,
	store: { type: String },
	name: { type: String, required: true},
	quantity: { type: String, default: "?"},
})

const OnlineItem = new Schema({
	_id: Schema.ObjectId,
	store: { type: String },
	name: { type: String, required: true},
	url: { type: String, default: "No link provided"},
	quantity: { type: String, default: "?"},
})

const GroceryListSchema = new Schema({
	items: [GroceryItem],
})

GroceryListSchema.post('save', async function(doc, next) {
	const { category, items } = doc;
	const stores = Array.from(new Set(items.map(item => item.store)));
	const dbStores = await Store.find();
	const dbStoreNames = Array.from(new Set(dbStores.map(store => store.name)));

	stores.forEach(async function (store) {
		if(dbStoreNames.includes(store)){
			console.log('Know store', store)
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

	next();
})

const HardwareListSchema = new Schema({
	items: [HardwareItem]
})

const OnlineListSchema = new Schema({
	items: [OnlineItem],
})


const ShoppingList = mongoose.model('shoppingList', ShoppingListSchema);

const GroceryList = ShoppingList.discriminator(ListCategoriesEnum.GROCERY, GroceryListSchema);

const HardwareList = ShoppingList.discriminator(ListCategoriesEnum.HARDWARE, HardwareListSchema);

const OnlineList = ShoppingList.discriminator(ListCategoriesEnum.ONLINE, OnlineListSchema);

module.exports.GroceryList = GroceryList;
module.exports.HardwareList = HardwareList;
module.exports.OnlineList = OnlineList;
module.exports.ShoppingList = ShoppingList;
module.exports.ListCategoriesEnum = ListCategoriesEnum;



