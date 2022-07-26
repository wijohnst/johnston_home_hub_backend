const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FeedStatusSchema = new Schema({
    // Human readable date string
    date: { type: String },
    /*
		`breakfast` and `dinner` arrays are have entries equal to
		Pet.Name. If a pet is included in the array then they have been fed for that meal. 
	*/
    breakfast: [{ type: String }],
    dinner: [{ type: String }],
})

const FeedStatus = mongoose.model('feedStatus', FeedStatusSchema)

module.exports.FeedStatus = FeedStatus
