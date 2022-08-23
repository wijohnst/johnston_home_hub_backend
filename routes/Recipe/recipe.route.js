/* eslint-disable no-unused-vars */
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { getTargetSelectorFromUrl } = require('./recipe.route.utils');
const { HTTPMessagesEnum } = require('../../constants');

const router = express.Router();

router.post('/generate', async (req, res) => {
	console.log('Generating requested recipe...');
	const { url } = req.body;

	try{

		const targetSelectors = getTargetSelectorFromUrl(url);	
		
		const { data } = await axios(url);	
		const $ = cheerio.load(data);
	
		
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

module.exports = router;