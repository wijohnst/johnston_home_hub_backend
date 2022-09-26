/** Utilty files for the `MealPlanner` API */

const format = require('date-fns/format');
const addDate = require('date-fns/add');

const { DateFormats } = require('../../constants');

const mongoose = require('mongoose');
const { Meal } = require('../../models/MealPlaner/mealplan.model');

const generateTargetMeal = async (targetMealType, targetSimplifiedDate ) => {
	const mealDate = new Date(targetSimplifiedDate);

	const newTargetMeal = new Meal({
		_id: mongoose.Types.ObjectId(),
		date: mealDate,
		mealType: targetMealType,
		recipes: [],
	});

	await newTargetMeal.save();

	return newTargetMeal;
}

const getMealPlanDates = (now) => {
	console.log('Getting Meal Plan Dates...')

	const daysFromNowArray = [0, 1, 2, 3, 4, 5, 6];

	return daysFromNowArray.map(daysFromNow => format(addDate(now, {days: daysFromNow}),DateFormats.CALENDAR_DATE));

}

module.exports.generateTargetMeal = generateTargetMeal;
module.exports.getMealPlanDates = getMealPlanDates;