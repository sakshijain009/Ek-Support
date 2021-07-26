const mongoose = require('mongoose');

const donateSchema = new mongoose.Schema({
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
    pincode: {
        type : String,
        required: true
    },
    street: {
        type : String,
        required: true
    },
	quantity: {
        type : String,
        required: true
    },
    delivery: {
        type : String,
        required: true
    },
	date: {
        type : Date,
        required: true
    }
})

module.exports = DonateModel = mongoose.model('donate', donateSchema);