const HTTPMessagesEnum = Object.freeze({
    PETS_FETCHED: 'Pets fetched successfully.',
    FEEDER_DATA_FETCHED: 'Feeder data fetched successfully.',
    FEEDER_DATA_PATCED: 'Feeder data patched successfully.',
		CHORE_DATA_FETCHED: 'Chore data fetched successfully.',
		NEW_CHORE_ADDED: 'New chore added successfully.',
		CHORE_UPDATED: 'Chore last completed date updated successfully.',
		SHOPPING_LISTS_FETCHED: 'Shopping Lists fetched successfully.',
		SHOPPING_LIST_UPDATED: 'Shopping List updated successfully.',
		AISLES_FETCHED: 'Aisles fetched successfully.',
		LIST_ITEM_DELETED: 'Shopping list item deleted successfully.',
		STORES_FETCHED: {
			SUCCESS: 'Stores fetched successfully.',
			FAILED: 'Fetching stores failed.',
			FINALLY: 'GET: /shoppingLists/stores completed.'
		}, 
});

const ListCategoriesEnum = Object.freeze({
	GROCERY : "Grocery",
	HARDWARE: "Hardware",
	ONLINE : "Online",
});

module.exports.HTTPMessagesEnum = HTTPMessagesEnum;
module.exports.ListCategoriesEnum = ListCategoriesEnum;
