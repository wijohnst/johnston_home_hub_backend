/*
	Model file for the Shopping List `Item` data type
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
	_id: Schema.ObjectId,
	store: { type: String },
	name: { type: String, required: true},
	quantity: { type: String, default: "?"},
});

const GroceryItemSchema = new Schema({
	_id: Schema.ObjectId,
	name: { type: String, required: true},
	store: { type: String },
	aisle: { type: String, deafult: "Miscelaneous"},
	quantity: { type: String, default: "?"},
})


const OnlineItemSchema = new Schema({
	_id: Schema.ObjectId,
	store: { type: String },
	name: { type: String, required: true},
	url: { type: String, default: "No link provided"},
	quantity: { type: String, default: "?"},
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
