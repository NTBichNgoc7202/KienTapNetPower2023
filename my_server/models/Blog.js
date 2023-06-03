const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Blog = new Schema({
    name: { type: String },
    image: { type: String },
    detail: { type: String },
    createdAt: { type: String, default: Date.now() },
    modifiedAt: { type: String, default: Date.now() }
})

module.exports = mongoose.model('Blog', Blog, 'blog')