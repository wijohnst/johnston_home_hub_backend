const express = require('express');

const router = express.Router();

const { MealTypes } = require('../MealPlanner/mealplanner.route');

router.get('/', async () => {
	console.log('Getting meal plans...');

	/*
		* Starting with today's date, return the `MealPlan` associated with the current data as well as the consecutive 6 dates: 

		type MealPlan:
		{
			date: Date,
			meals: {
				BREAKFAST: Recipe[],
				LUNCH: Recipe[],
				DINNER: Recipe[],
				SNACK: Recipe[],
			},
			linkedRecipeIds: string[],
		}

		return type MealPlans = MealPlan[]

		! If there is not a given `Meal` (BREAKFAST, LUNCH, DINNER, SNACK) associated with a date (Meal.findOne({date: targetDate, mealType: targetMealType}) === null), create a new `MealPlan` 

		new Meal({
			_id: ...,
			* index value === 0 - 6 *
			date: new Date(deriveNormalizedDateFromValue(index)),
			mealType: targetMealType,
			* a new `Meal` should have [0] recipes *
			recipes: [],
		})

	*/

	const today = new Date();
	console.log(today);
})

module.exports = router;