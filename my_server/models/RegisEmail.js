const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const RegisEmail = new Schema({
    useremail: { type: String }
})

module.exports = mongoose.model('RegisEmail', RegisEmail, 'regisemail');