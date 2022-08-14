/*
	Model file for the Recipe Data Type / Document
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
	_id: Schema.ObjectId,
});

const StepSchema = new Schema({
	_id: Schema.ObjectId,
})

const RecipeSchema = new Schema({
	_id: Schema.ObjectId,
	ingredients: { type: [IngredientSchema], required: true},
	steps: {type: [StepSchema], required: true},
	/** Optional - only present on Recipes that were created via link */
	url: {type: String},
});

const Recipe = mongoose.model('Recipe', RecipeSchema);
module.exports.Recipe = Recipe;