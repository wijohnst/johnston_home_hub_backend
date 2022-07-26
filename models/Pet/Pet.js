const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpeciesEnum = Object.freeze({
	DOG: 'DOG',
	CAT : 'CAT',
	BIRD: 'BIRD'
});

const PetSchema = new Schema({
 _id: String,
 name: String,
 species: {
	type: String,
	enum: Object.values(SpeciesEnum),
 },
 iconId: {
	type: String,
	default: 'default-pet-icon'
 } 
});

module.exports.Pet = mongoose.model('pet', PetSchema);