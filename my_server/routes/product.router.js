const express = require("express");
const productRouter = express.Router();
const md5 = require("md5");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const Product = require("../models/Product");
const Category = require("../models/Category");

// get product
productRouter.get("", async (req, res) => {
  Product.find({})
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});

productRouter.get("/tag/:note", async (req, res) => {
  let note = req.params.note;
  Product.find({ note: note })
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});

// get category
productRouter.get("/categories", async (req, res) => {
  Category.find({})
    .then((category) => {
      res.json(category);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});

productRouter.get("/category/:id", async (req, res) => {
  Product.find({ categoryId: req.params.id })
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});

productRouter.get("/:id", async (req, res) => {
  let o_id = new mongoose.Types.ObjectId.createFromHexString(req.params.id);
  Product.findById(o_id)
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});
// post product
productRouter.post("", async (req, res) => {
  req.body._id = null;
  Product.insertMany(req.body).then((docs, err) => {
    if (docs) {
      res.send("OK");
    } else {
      res.send(err);
    }
  });
});
// update product
productRouter.put("", async (req, res) => {
  Product.findByIdAndUpdate(req.body._id, {
    $set: {
      name: req.body.name,
      price: req.body.price,
      categoryId: req.body.categoryId,
      image: req.body.image,
      note: req.body.note,
      description: req.body.description,
    },
  }).then((docs, err) => {
    if (docs) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });
});

// delete product
productRouter.delete("", async (req, res) => {
  Product.findByIdAndDelete(req.body._id).then((docs, err) => {
    if (docs) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = productRouter;
