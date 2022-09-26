const express = require('express');

const router = express.Router();

const { MealTypes, Meal } = require('../../models/MealPlaner/mealplan.model');
const { generateTargetMeal, getMealPlanDates } = require('./mealplanner.utils.route');
const { HTTPMessagesEnum } = require("../../constants")

router.get('/', async (_req, res) => {
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

		outer iteration: DATES [0 - 6]
			innter iteration: MEALS [0 - 4]

	*/
	
	const now = new Date();
	const mealPlanDates = getMealPlanDates(now);
	const mealTypes = Object.values(MealTypes);
	
		try {
			const mealPlans = await Promise.all(mealPlanDates.map(async (simplifiedTargetDate) => {
				const mealsByType = await Promise.all(mealTypes.map(async (mealType) => {
					const targetMealType = mealType.text;
					
					const targetMeals = await Meal.find({ date: simplifiedTargetDate, mealType: targetMealType });			
					if(targetMeals.length > 0 ){
						return targetMeals
					}else{
						const newMeal = generateTargetMeal(targetMealType, simplifiedTargetDate);
						return newMeal;
					}
				}))
				return { [simplifiedTargetDate] : mealsByType}
			}));

			res.status(200).json({
				status: 200,
				message: HTTPMessagesEnum.MEALS_FETCHED.SUCCESS,
				mealPlans,
			})
		} catch (error) {
			res.status(400).json({
				status: 400,
				message: error,
			})
		}finally{
			console.log(HTTPMessagesEnum.MEALS_FETCHED.FINALLY)
		}
	/*
		mealPlans = {
			[key : SimplifiedDate] : Meals[]
		}
	*/
})

router.delete('/all', async (_req, res) => {
		try {
			await Meal.deleteMany({});
			console.log("Meals deleted...")
			res.status(200).json({
				status: 200,
				message: "Meals Deleted."
			})
				
		} catch (error) {
			console.error(error);	
			res.status(400).json({
				status: 400,
				message: "Something went wrong."
			})
		}
	
})

module.exports = router;