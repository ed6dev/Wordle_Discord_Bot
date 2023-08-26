const { Schema, model } = require("mongoose");

const data = new Schema({
    userId: {
        type: String,
        required: true,
    },
    GamesPlayed: {
        type: Number,
        default: 0
    },
    GamesWon: {
        type: Number,
        default: 0
    },
    BestScore: {
        type: Number,
        default: 0
    },
    BestTime: {
        type: Number,
        default: 0
    }
})

module.exports = model('Profile', data)