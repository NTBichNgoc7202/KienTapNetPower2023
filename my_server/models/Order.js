const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Order = new Schema(
  {
    unique_id: { type: String , default:""},
    username: { type: String },
    phone: { type: String },
    address: { type: String },
    payment: { type: String },
    totalPrice: { type: Number },
    products: { type: Array },
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Order", Order, "order");
