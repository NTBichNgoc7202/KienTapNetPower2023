const express = require("express");
const orderRouter = express.Router();
const md5 = require("md5");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const Order = require("../models/Order");

// Order
orderRouter.get("", async (req, res) => {
  Order.find({})
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});

orderRouter.get("/:unique_id", async (req, res) => {
  Order.find({ unique_id: req.params.unique_id })
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});

orderRouter.post("", async (req, res) => {
  if (req.session.unique_id != null) {
    req.body.unique_id = req.session.unique_id;
  }
  let totalPrice = 0;
  req.body.products.forEach((product) => {
    totalPrice += product.price * product.quantity;
  });
  req.body.totalPrice = totalPrice;
  const order = new Order(req.body);
  Order.insertMany(order).then((order) => {
    res.json(order);
  });
});


orderRouter.delete("", async (req, res) => {
  Order.findByIdAndDelete(req.body._id).then((docs, err) => {
    if (docs) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = orderRouter;
