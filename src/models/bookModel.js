
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const bookModel = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },
    excerpt: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        ref: "user",
        required: true

    },
    ISBN: {

        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: String
    },
    reviews: {
        type: Number,
        default: 0
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        required: true
    },

}, { timestamps: true })

module.exports = mongoose.model('book', bookModel)