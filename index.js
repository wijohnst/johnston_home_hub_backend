const express = require('express');
const app = express();
const port = 6666;

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.listen(port, () => {
	console.log(`Johnston Home Hub is listening on port ${port}`);
})