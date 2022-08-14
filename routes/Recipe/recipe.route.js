/* eslint-disable no-unused-vars */
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const pretty = require('pretty');

const router = express.Router();

router.get('/generate', async (req, res) => {
	console.log('Generating requested recipe...');

	const url = "https://www.allrecipes.com/recipe/20724/grilled-corn-on-the-cob/";
	try{

		const { data } = await axios(url);	
		const $ = cheerio.load(data);
	
		const targetSelectors = {
			targetParentClass: ".ingredients-section",
			targetDomElementClass: ".ingredients-item-name",
		};

		const ingredientsSection = $(targetSelectors.targetParentClass);
		const ingredients = [];

		/*
			Finds each target DOM element in the section and returns that targets text content, trimming whitespace for each string
		*/
		$(ingredientsSection.find($(targetSelectors.targetDomElementClass))).each((_index, element) => ingredients.push($(element).text().trim()));

		res.status(200).json({
			status: 200,
			message: "Bingo. "
		})

	}catch(error){
		console.error(error)
	}
});

module.exports = router;