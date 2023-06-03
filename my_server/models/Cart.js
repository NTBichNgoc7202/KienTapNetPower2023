const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Cart = new Schema({
    unique_id: { type: String },
    username: { type: String },
    phone: { type: String },
    address: { type: String },
    payment: { type: String },
    products: { type: Array },
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Cart', Cart, 'cart')