const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = new Schema(
  {
    phone: { type: String },
    pass: { type: String },
    username: { type: String },
    useremail: { type: String },
    address: { type: String },
    unique_id: { type: String },
    image: { type: String },
    salt: { type: String },
  },
  { versionKey: false }
);

module.exports = mongoose.model("User", User, "user");
