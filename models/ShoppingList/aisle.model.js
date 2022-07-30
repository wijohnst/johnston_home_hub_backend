/*
	Model file for the aisle data type

	Aisle is a sub-document of Item, which is a sub-document of ShoppingList

	shoppingList {
		item {
			aisle,
			...rest
		}
		...rest
	}

*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AisleSchema = new Schema({
	_id: Schema.ObjectId,
	aisle: { type : String, default: "Miscelaneous"}
});

const Aisle = mongoose.model('aisle', AisleSchema);

module.exports.Aisle = Aisle;

