const express = require('express');

const router = express.Router();

router.get('/', async(req, res) => {
	console.log('Fetching chore data from `chores/`...');
})

module.exports = router;