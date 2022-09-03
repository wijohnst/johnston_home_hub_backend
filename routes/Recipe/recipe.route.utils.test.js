const { describe, expect, it } = require('@jest/globals');
const { getHostFromUrl, getTargetSelectorFromUrl, TargetSelectorsMap } = require('./recipe.route.utils');

describe("Recipe route utils unit tests", () => {

	describe("getHostFromUrl unit tests", () => {
		it(`Should return 'allRecipes' `, () => {
			const testUrl = "https://www.allrecipes.com/test";
	
			expect(getHostFromUrl(testUrl)).toEqual('allrecipes');
		})
	});

	describe("getTargetSelectorFromUrl unit tests", () => {
		it(`Should return the correct TargetSelector`, () => {
			const testUrl = "https://www.allrecipes.com/test";

			const targetSelector = TargetSelectorsMap.allrecipes;

			expect(getTargetSelectorFromUrl(testUrl)).toEqual(targetSelector);
		});

		it(`Should return undefined when there is not a corresponding target selector`, () => {
			const testUrl = "https://www.somerecipes.com/test";

			expect(getTargetSelectorFromUrl(testUrl)).toEqual(undefined);
		})
	})
})