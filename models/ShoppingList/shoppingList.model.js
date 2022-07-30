/*
	Model file for the ShoppingList Data Type
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { addNewStoresMiddleware } = require('../utils/shoppingList.utils');

const ListCategoriesEnum = Object.freeze({
	GROCERY : "Grocery",
	HARDWARE: "Hardware",
	ONLINE : "Online",
});

const options = { discriminatorKey: 'category'};

const ShoppingListSchema = new Schema({
	_id: Schema.ObjectId,
}, options)

const HardwareListSchema = new Schema({
	items: [{type : Schema.Types.ObjectId, ref: 'Item'}]
})

HardwareListSchema.post('save', async function(doc, next) {
	await addNewStoresMiddleware(doc);
	next();
})

const GroceryListSchema = new Schema({
	items: [{ type: Schema.Types.ObjectId, ref: 'GroceryItem' }],
})

GroceryListSchema.post('save', async function(doc, next) {
	// await addNewStoresMiddleware(doc);
	next();
})


const OnlineListSchema = new Schema({
	items: [{type: Schema.Types.ObjectId, ref: 'OnlineItem'}],
})

OnlineListSchema.post('save', async function(doc, next) {
	// await addNewStoresMiddleware(doc);
	next();
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



