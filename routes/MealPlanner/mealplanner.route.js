const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const { MealTypes, Meal, LockedRecipe } = require('../../models/MealPlaner/mealplan.model');
const { generateTargetMeal, getMealPlanDates } = require('./mealplanner.utils.route');
const { HTTPMessagesEnum } = require("../../constants")

router.get('/', async (_req, res) => {
	console.log('Getting meal plans...');

	/*
		! WHAT DO YOU WANT TO RETURN:

		{
			10/6/2022 : {
				BREAKFAST : MealPlan,
				LUNCH: MealPlan,
				DINNER: MealPlan,
				SNACK: MealPlan,	
			},
			... other dates
		}
	*/
	const now = new Date();
	const mealPlanDates = getMealPlanDates(now);
	const mealTypes = Object.values(MealTypes);
	
		try {
			// Returns a nested object => { [key : simplifiedDate] : MealPlan[] }
			const mealPlans = mealPlanDates.reduce(async (acc, simplifiedTargetDate) => {
			// const mealPlans = await Promise.all(mealPlanDates.reduce(async (acc, simplifiedTargetDate) => {
				// For each simplified date in `mealPlanDates`, iterate over the meal types (BREAKFAST, LUNCH, DINNER, SNACK) 
				const mealsByType = await Promise.all((mealTypes.map(async (mealType) => {
				// const mealsByType = await Promise.all((mealTypes.map(async (mealType) => {
					const targetMealType = mealType.text;
					// Try to find a meal of the given type for the given date :  e.g.: 'Is there a breakfast schedulded for 10/6/2022?'
					const targetMeal = await Meal.findOne({date: simplifiedTargetDate, mealType: targetMealType}).populate({path: 'recipes', select: '_id name'});
					//If you find that meal, return it
					if(targetMeal){
						return targetMeal
					// If you don't, create a new "empty" meal and return that. 
					}else{
						// An "empty" meal is a MealPlan object with an empty `recipes` array
						const newMeal = generateTargetMeal(targetMealType, simplifiedTargetDate);
						return newMeal;
					}
				})))
				
				// return {...await acc, [simplifiedTargetDate]: mealsByType}
				return {...await acc, [simplifiedTargetDate]: mealsByType}
			},{})

			res.status(200).json({
				status: 200,
				message: HTTPMessagesEnum.MEALS_FETCHED.SUCCESS,
				mealPlans: await mealPlans,
			})
		} catch (error) {
			res.status(400).json({
				status: 400,
				message: error.message,
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

router.get('/locked_recipes', async (_req,res) => {
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
});

// eslint-disable-next-line no-unused-vars
router.post('/locked_recipes', async (req, res) => {
	/*
		Accepts a `lockedRecipe` request:

		req.body = {
			...,
			lockedRecipe: {
				recipeId: string,
				mealType: MealType,
				daysLocked: number[],
			}
		}

		A new `LockedRecipe` document is created based on this data. 
		
		! ON REDUNDANT DOCUMENTS !

		It does not matter if another `LockedRecipe` exists with the same `recipeId`. You may have a recipe locked for breakfast on days `[0,2]` and the same recipe locked for lunch on days `[1,4]`. We want to allow this. 
	*/
	console.log('Posting locked recipe...');
		try {
			const { lockedRecipe : { recipeId, mealType, daysLocked} } = req.body;	

			await new LockedRecipe({
				_id: mongoose.Types.ObjectId(),
				recipeId: mongoose.Types.ObjectId(recipeId),
				mealType,
				daysLocked,
			}).save();

			res.status(200).json({
				status: 200,
				message: HTTPMessagesEnum.LOCKED_RECIPE_POSTED.SUCCESS,
			});

		} catch (error) {
			console.log(error.message)
			res.status(400).json({
				status: 400,
				message: error.message,
			})
		}finally{
			console.log(HTTPMessagesEnum.LOCKED_RECIPE_POSTED.FINALLY);
		}
});

router.delete('/locked_recipes', async (req, res) => {
	console.log("Deleteing Locked Recipe...");
		try {
			const { lockedRecipeIdToDelete } = req.body;	
			const query = { _id: lockedRecipeIdToDelete };

			LockedRecipe.findOneAndDelete(query, (error) => {
				if(error){
					console.log("LockedRecipe was not deleted.", error)
					res.status(400).json({
						status: 400,
						message: error.message
					});
				}else{
					res.status(200).json({
						status: 200,
						message: HTTPMessagesEnum.LOCKED_RECIPE_DELETED.SUCCESS,
					})
				}
			}) 
		} catch (error) {
			console.error(error);	
			res.status(400).json({
				status: 400,
				message: error.message,
			})
		}finally{
			console.log(HTTPMessagesEnum.LOCKED_RECIPE_DELETED.FINALLY)
		}
})

module.exports = router;