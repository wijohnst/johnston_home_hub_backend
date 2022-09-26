/*
	Model file for the MealPlan Schema & Associated Child Schema
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Acceptable meal types enum
const MealTypes = Object.freeze({
	BREAKFAST : {text: "breakfast", value: 0},
	LUNCH: { text: "lunch", value: 1},
	DINNER: { text: "dinner", value: 2},
	SNACK: { text: "snack", value: 3}, 
}); 

const EmptyMeals = Object.freeze({
	[MealTypes.BREAKFAST.text] : [],
	[MealTypes.LUNCH.text]: [],
	[MealTypes.DINNER.text]: [],
	[MealTypes.SNACK.text]: [],
})

const MealSchema = new Schema({
	_id: Schema.ObjectId,
	date: {type: Date, required: true}, 
	mealType: {type: String, required: true},
	recipes: [{type: Schema.Types.ObjectId, ref: "Recipe", required: true}],
});

const Meal = mongoose.model('Meal', MealSchema);


const LockedRecipeSchema = new Schema({
	_id: Schema.ObjectId,
	recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true }
});

const LockedRecipe = mongoose.model('LockedRecipe', LockedRecipeSchema);

module.exports.Meal = Meal;
module.exports.MealTypes = MealTypes;
module.exports.LockedRecipe = LockedRecipe;
module.exports.EmptyMeals = EmptyMeals;
