require('dotenv').config();

const Pet = require('./models/Pet/Pet');
const defaultPetData = require('./models/Pet/defaultPets.json')
const cors = require('cors');
const mongoString = process.env.DATABASE_URL;
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3001;

mongoose.connect(mongoString);
const database = mongoose.connection;

const petsRouter = require('./routes/Pets/pets');
const feederRouter = require('./routes/Feeder/feeder');

database.on('error', (error) => {
	console.log('DB Connection Error', error);
})

database.once('connected', async () => { 
	console.log('Successfully connected to MongoDB...');
})

app.use(cors());
app.use(express.json());

//ROUTES
app.use('/pets', petsRouter)
app.use('/feeder', feederRouter)

app.listen(port, () => {
	console.log(`Johnston Home Hub is listening on port ${port}`);
});

const addPets = () => {
	console.log('No pets found. Adding known pets to DB...')
	if(defaultPetData){
		defaultPetData.forEach(async (PetData) => {
			const newPet = new Pet(PetData);
			await newPet.save();
		})
	}
}