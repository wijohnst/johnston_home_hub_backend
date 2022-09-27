const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const { MealTypes, Meal, LockedRecipe } = require('../../models/MealPlaner/mealplan.model');
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
})

/*
	! DELETES ALL MEAL DOCUMENTS !
	! USE WITH CAUTION !
 */
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
});

router.patch('/meal', async (req, res) => {
/*
	This endpoint updates a given Meal, specifically updating the associated `Recipes` array 
	
	* req.body = {
	* 	updatedMeal: Meal
	* }

	
	use `findOneAndUpdate({_id: updatedMeal._id})

*/

const { updatedMeal } = req.body;

	try {
	const targetMeal = await Meal.findById(updatedMeal._id);
		
	const newRecipeIds = updatedMeal.recipes.filter((recipeId) => !targetMeal.recipes.includes(recipeId));

	if(newRecipeIds.length){
		console.log("Adding updated recipe Ids...")

		newRecipeIds.forEach(recipeId => targetMeal.recipes.push(new mongoose.Types.ObjectId(recipeId)));

		await targetMeal.save();
	}


	 res.status(200).json({
		status: 200,
		message: HTTPMessagesEnum.MEAL_UPDATED.SUCCESS
	 })
	} catch (error) {
		res.status(400).json({
			status: 200,
			message: error,
		})
	}finally{
		console.log(HTTPMessagesEnum.MEAL_UPDATED.FINALLY)
	}
});

router.get('/locked_recipes', async (req,res) => {
	console.log('Getting locked recipes...');
		try {
			const lockedRecipes = await LockedRecipe.find({});
			res.status(200).json({
				status: 200,
				message: HTTPMessagesEnum.LOCKED_RECIPES_FETCHED.SUCCESS,
				lockedRecipes,
			})
		} catch (error) {
			res.status(400).json({
				status: 400,
				message: error,
			})
		}finally{
			console.log(HTTPMessagesEnum.LOCKED_RECIPES_FETCHED.FINALLY)
		}
})

module.exports = router;