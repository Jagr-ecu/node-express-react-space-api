const mongoose = require('mongoose')

const launchSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true
    },
    mission: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    launchDate: {
        type: Date,
        required: true
    },
    // target: {
    //     type: mongoose.ObjectId,
    //     ref: 'Planet'
    // },
    target: {
        type: String,
    },
    customers: [ String ],
    upcoming: {
        type: Boolean,
        required: true
    },
    success: {
        type: Boolean,
        required: true
    },
})

module.exports = mongoose.model('Launch', launchSchema)