/*
	Model file for the `Chore` data type / Document Type 
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChoreSchema = new Schema({
	_id: Schema.ObjectId,
	name: String,
	intervalDays: Number,
	lastCompleted: Date,
});

module.exports.Chore = mongoose.model('chore', ChoreSchema);