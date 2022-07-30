/*
	Model file for the `Store` data type. 

	`Store` is a sub-doucment of `ShoppingList` 
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
	_id: Schema.ObjectId,
	name: { type: String },
	category: { type: String, default: 'Unassigned'},
});

module.exports.Store = mongoose.model('store', StoreSchema);