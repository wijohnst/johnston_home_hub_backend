/*
	Model file for the ShoppingList Data Type
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const  { ListCategoriesEnum } = require('../../constants');

const { ItemSchema, GroceryItemSchema, OnlineItemSchema } = require('./item.model');
const { StoreSchema } = require('./store.model');
const { AisleSchema } = require('./aisle.model');

const { addNewStoresMiddleware } = require('../utils/shoppingList.utils');

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
	items: [{ type: Schema.Types.ObjectId, ref: 'GroceryItem'}],
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

const Store = mongoose.model('Store', StoreSchema);
const Aisle = mongoose.model('Aisle', AisleSchema);

const Item = mongoose.model('Item', ItemSchema);
const GroceryItem = mongoose.model('GroceryItem', GroceryItemSchema);
const OnlineItem = mongoose.model('OnlineItem', OnlineItemSchema);

const GroceryList = ShoppingList.discriminator(ListCategoriesEnum.GROCERY, GroceryListSchema);

const HardwareList = ShoppingList.discriminator(ListCategoriesEnum.HARDWARE, HardwareListSchema);

const OnlineList = ShoppingList.discriminator(ListCategoriesEnum.ONLINE, OnlineListSchema);

module.exports.Store = Store; 
module.exports.Aisle = Aisle;

module.exports.Item = Item;
module.exports.GroceryItem = GroceryItem;
module.exports.OnlineItem = OnlineItem;

module.exports.GroceryList = GroceryList;
module.exports.HardwareList = HardwareList;
module.exports.OnlineList = OnlineList;
module.exports.ShoppingList = ShoppingList;



