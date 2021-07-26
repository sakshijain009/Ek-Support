const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true
    },
	email: {
        type : String,
        required: true
    },
	contact: {
        type : Number,
        required: true
    },
	city: {
        type : String,
        required: true
    },
	state: {
        type : String,
        required: true
    },
	reason: {
        type : String,
        required: true
    },
	date: {
        type : Date,
        required: true
    }
})

module.exports = VolunteerModel = mongoose.model('volunteer', volunteerSchema);