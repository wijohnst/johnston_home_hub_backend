/*
	Model file for the ShoppingList Data Type
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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



