const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Category = new Schema({
    name: { type: String },
    icon_url: { type: String }
})

module.exports = mongoose.model('Category', Category,'category')