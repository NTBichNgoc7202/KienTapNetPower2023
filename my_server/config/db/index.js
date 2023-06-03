const mongoose = require('mongoose')
require('dotenv/config')

async function connect() {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.info('Connected to database successfully')
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = { connect }

