/* eslint-disable no-unused-vars */
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const { getTargetSelectorFromUrl } = require('./recipe.route.utils');
const { HTTPMessagesEnum } = require('../../constants');
const { Recipe } = require('../../models/Recipe/recipe.model');

const router = express.Router();


/*
	interface Ingredient {
		name: string; // this can include the items name and any preparation 
		quantity: string | null;
		unit: string | null; // quantity + unit = ammount
		linkedItem: string | null; // Refernces a GroceryItem by UUID
	}	

	ex: 
	{
		name: 'Corn, fresh, outer leaves and inner strings removed',
		quantity: 6,
		unit: 'ears',
	}

	interface RecipeData {
		name: string;
		ingredients: Ingredient[];
		steps: string[];
		url: string | null; // Only present for recipes that were generated via web link
	}
*/
router.post('/', async (req, res) => {
	console.log(('Adding new recipe...'))
	const { recipeData } = req.body;
	console.log(recipeData);

	try {
		const newRecipe = new Recipe({_id: mongoose.Types.ObjectId(), ...recipeData});
		await newRecipe.save();

		res.status(200).json({
			status: 200,
			message: HTTPMessagesEnum.ADD_RECIPE.SUCCESS, 
		})
	}catch(error){
		console.error(error);
		res.status(400).json({
			status: 400,
			message: error,
		})
	}finally{
		console.log(HTTPMessagesEnum.ADD_RECIPE.FINALLY);
	}
});

router.post('/generate', async (req, res) => {
	console.log('Generating requested recipe...');
	const { url } = req.body;

	try{

		const targetSelectors = getTargetSelectorFromUrl(url);	
		
		const { data } = await axios(url);	
		const $ = cheerio.load(data);

		const name = $(targetSelectors.targetDomElementClass.name).text();
	
		const ingredientsSection = $(targetSelectors.targetParentClass.ingredients);
		const ingredients = [];

		/*
			Finds each target DOM element in the section and returns that targets text content, trimming whitespace for each string
		*/
		$(ingredientsSection.find($(targetSelectors.targetDomElementClass.ingredient))).each((_index, element) => ingredients.push($(element).text().trim()));

		const stepsSection = $(targetSelectors.targetParentClass.steps);
		const steps = [];

		$(stepsSection.find($(targetSelectors.targetDomElementClass.step))).each((_index, element) => steps.push($(element).text().trim()));

		res.status(200).json({
			status: 200,
			message: HTTPMessagesEnum.GENERATE_RECIPE.SUCCESS,
			recipe: {
				name,
				ingredients,
				steps
			}
		})

	}catch(error){
		console.error(error);
		res.status(400).json({
			status: 400,
			message: error,
		})
	}
});

router.get('/', async (req, res) => {
	console.log('Getting recipes...')
	try{
		const recipes = await Recipe.find().populate({
			path: 'ingredients',
			populate: { path: 'linkedItem'}
		});
		res.status(200).json({
			status: 200,
			message: HTTPMessagesEnum.RECIPES_FETCHED.SUCCESS,
			recipes,
		})
	}catch(error){
		res.status(400).json({
			status: 400,
			message: error,
		})
	}finally{
		console.log(HTTPMessagesEnum.RECIPES_FETCHED.FINALLY)
	}
});

router.patch('/', async (req, res) => {
	console.log('Patching recipe...');

	const { recipeToUpdate } = req.body;

	try {
		const targetRecipe = await Recipe.findOneAndUpdate({_id: recipeToUpdate._id}, recipeToUpdate);
		
		console.log(targetRecipe);
		res.status(200).json({
			status: 200,
			message: HTTPMessagesEnum.RECIPE_UPDATED.SUCCESS,
		})
	}catch(error){
		res.status(400).json({
			status: 400,
			message: error,
		})
	}finally{
		console.log(HTTPMessagesEnum.RECIPE_UPDATED.FINALLY)
	}
})

module.exports = router;