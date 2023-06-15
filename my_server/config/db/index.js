const mongoose = require("mongoose");
const databaseUrl = require('./database.url');

async function connect() {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(databaseUrl);
    console.info("Connected to database successfully");
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = { connect };
