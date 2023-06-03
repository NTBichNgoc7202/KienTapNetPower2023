const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Favorite = new Schema({
    unique_id: { type: String },
    products: { type: Array },
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now },
}, {
    versionKey: false // You should be aware of the outcome after set to false
})

module.exports = mongoose.model('Favorite', Favorite, 'favorite')