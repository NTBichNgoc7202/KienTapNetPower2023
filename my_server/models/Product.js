const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema(
  {
    name: { type: String },
    image: { type: String },
    price: { type: Number },
    note: { type: String },
    categoryId: { type: String },
    description: { type: String },
    createdAt: { type: String, default: new Date().toISOString() },
    modifiedAt: { type: String, default: new Date().toISOString() },
    // createdAt: { type: String, default: Date.now() },
    // modifiedAt: { type: String, default: Date.now() },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Product", Product, "product");
