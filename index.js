require('dotenv').config();

const mongoString = process.env.DATABASE_URL;
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3001;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
	console.log('DB Connection Error', error);
})

database.once('connected', () => { 
	console.log('Successfully connected to MongoDB...')
})

app.use(express.json());

app.listen(port, () => {
	console.log(`Johnston Home Hub is listening on port ${port}`);
})