/*
	Model file for the Shopping List `Item` data type
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { ListCategoriesEnum } = require('../../models/ShoppingList/shoppingList.model');

const ItemSchema = new Schema({
	_id: Schema.ObjectId,
	name: { type: String, required: true},
	store: { type: Schema.Types.ObjectId, ref: 'Store' },
	quantity: { type: String, default: "Unknown Quantity"},
	category: { type: String, default: "Non-Categorized"}
});

const GroceryItemSchema = new Schema({
	_id: Schema.ObjectId,
	name: { type: String },
	store: { type: Schema.Types.ObjectId, ref: 'Store' },
	aisle: { type: Schema.Types.ObjectId, ref: "Aisle"},
	quantity: { type: String, default: "Not Specified"},
	category: { type: String, default: ListCategoriesEnum.GROCERY}
})


const OnlineItemSchema = new Schema({
	_id: Schema.ObjectId,
	name: { type: String, required: true},
	store: { type: Schema.Types.ObjectId, ref: 'Store' },	
	quantity: { type: String, default: "?"},
	url: { type: String, default: "No link provided"},
	category: { type: String, default: ListCategoriesEnum.ONLINE}
});

const Item = mongoose.model('item', ItemSchema);
const GroceryItem = mongoose.model('groceryItem', GroceryItemSchema);
const OnlineItem = mongoose.model('onlineItem', OnlineItemSchema);

module.exports.ItemSchema = ItemSchema;
module.exports.GroceryItemSchema = GroceryItemSchema;
module.exports.OnlineItemSchema = OnlineItemSchema;

module.exports.Item = Item;
module.exports.GroceryItem = GroceryItem;
module.exports.OnlineItem = OnlineItem;
