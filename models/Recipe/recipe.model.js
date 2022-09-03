/*
	Model file for the Recipe Data Type / Document
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
	Optional params are those that were not added by the user via the `EditRecipeForm` 

	For example, a user could scrape a recipe via a link and not break out the orginal `name` string into its parts:

	{
		name: "6 ears corn",
		quantity: null,
		unit: null,
		item: null,
	}

	vs:

	{
		name: "Corn",
		quantity: 6,
		unit: "ears",
		item: "some-item-uuid",
	}

	We want to allow the user to persist either version of the Ingredient.
*/
const IngredientSchema = new Schema({
	_id: Schema.ObjectId,
	name: { type: String, required: true},
	quantity: { type: Number, required: false},	
	unit: { type: String, required: false},
	linkedItem: { type: Schema.Types.ObjectId, ref: "GroceryItem", required: false},
});

const RecipeSchema = new Schema({
	_id: Schema.ObjectId,
	name: { type: String, required: true},
	ingredients: { type: [IngredientSchema], required: true},
	steps: {type: [String], required: true},
	/** Optional - only present on Recipes that were created via link */
	url: {type: String},
});

const Recipe = mongoose.model('Recipe', RecipeSchema);
module.exports.Recipe = Recipe;