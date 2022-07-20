const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.listen(port, () => {
	console.log(`Johnston Home Hub is listening on port ${port}`);
})