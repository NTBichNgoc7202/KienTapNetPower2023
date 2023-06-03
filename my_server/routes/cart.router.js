const express = require("express");
const cartRouter = express.Router();
const md5 = require("md5");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const User = require("../models/User");

const fetchUserById = async (id) => {
  let userInformation = await User.findOne({ unique_id: id }).select({
    _id: 0,
    phone: 1,
    username: 1,
    useremail: 1,
    address: 1,
    unique_id: 1,
  });
  return userInformation;
};

cartRouter.post("", async (req, res) => {
  if (req.session.unique_id != undefined) {
    let existingCart = await Cart.findOne({ unique_id: req.session.unique_id });
    if (existingCart != null) {
      let productsArray = existingCart.products;
      let index = productsArray.findIndex(
        (element) => element._id == req.body._id
      );
      if (index != -1) {
        productsArray[index].quantity += req.body.quantity;
      } else {
        productsArray.push(req.body);
      }
      await Cart.findOneAndUpdate(
        { unique_id: req.session.unique_id },
        { products: productsArray }
      );
    } else {
      let userInformation = await fetchUserById(req.session.unique_id);
      userInformation.products = [req.body];
      let cart = new Cart(userInformation);
      await Cart.insertMany(cart);
    }
  }
  if (req.session.guestCart == undefined) {
    req.session.guestCart = [];
  }
  let index = await req.session.guestCart.findIndex(
    (element) => element._id == req.body._id
  );
  if (index != -1) {
    req.session.guestCart[index].quantity += req.body.quantity;
    req.session.save();
    return res.json({ message: "success" });
  } else {
    await req.session.guestCart.push(req.body);
    req.session.save();
    return res.json({ message: "success" });
  }
});

cartRouter.get("", async (req, res) => {
  if (req.session.unique_id != undefined) {
    Cart.findOne({ unique_id: req.session.unique_id }).then((data, err) => {
      if (data) {
        res.json(data.products);
      } else {
        res.json([]);
      }
    });
  } else {
    res.json(req.session.guestCart);
  }
});

cartRouter.get("/count", async (req, res) => {
  if (req.session.unique_id != undefined) {
    Cart.findOne({ unique_id: req.session.unique_id }).then((data, err) => {
      if (data) {
        res.json(data.products.length);
      } else {
        res.json(0);
      }
    });
  } else {
    if (req.session.guestCart == undefined) {
      req.session.guestCart = [];
    }
    res.json(req.session.guestCart.length);
  }
});

cartRouter.put("/product/quantity", async (req, res) => {
  if (req.session.unique_id != undefined) {
    await Cart.findOne({ unique_id: req.session.unique_id }).then(
      async (data, err) => {
        if (data) {
          let productsArray = data.products;
          let index = productsArray.findIndex(
            (element) => element._id == req.body._id
          );
          if (index != -1) {
            productsArray[index].quantity = req.body.quantity;
          }
          await Cart.findOneAndUpdate(
            { unique_id: req.session.unique_id },
            { products: productsArray }
          );
        }
      }
    );
    return res.json({ message: "success" });
  }
  let index = req.session.guestCart.findIndex(
    (element) => element._id == req.body._id
  );
  if (index != -1) {
    req.session.guestCart[index].quantity = req.body.quantity;
    req.session.save();
    return res.json({ message: "success" });
  }
});

cartRouter.delete("", async (req, res) => {
  if (req.session.unique_id != undefined) {
    await Cart.findOne({ unique_id: req.session.unique_id }).then(
      async (data, err) => {
        if (data) {
          let productsArray = data.products;
          let index = productsArray.findIndex(
            (element) => element._id == req.body._id
          );
          if (index != -1) {
            productsArray.splice(index, 1);
          }
          await Cart.findOneAndUpdate(
            { unique_id: req.session.unique_id },
            { products: productsArray }
          );
        }
      }
    );
    res.json({ message: "success" });
  } else {
    let index = req.session.guestCart.findIndex(
      (element) => element._id == req.body._id
    );
    if (index != -1) {
      req.session.guestCart.splice(index, 1);
      req.session.save();
      res.json({ message: "success" });
    }
  }
});

cartRouter.patch("", async (req, res) => {
  if (req.session.unique_id != undefined) {
    await Cart.findOne({ unique_id: req.session.unique_id }).then(
      async (data, err) => {
        if (data) {
          await Cart.findOneAndUpdate(
            { unique_id: req.session.unique_id },
            { products: [] }
          );
        }
      }
    );
    res.json({ message: "success" });
  } else {
    req.session.guestCart = [];
    req.session.save();
    res.json({ message: "success" });
  }
});

/*
// get cart
cartRouter.get("", async (req, res) => {
  Cart.find({})
    .then((cart) => {
      res.json(cart);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});

cartRouter.get("/count", async (req, res) => {
  Cart.countDocuments({})
    .then((cart) => {
      res.json(cart);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});

cartRouter.post("", async (req, res) => {
  var o_id = new mongoose.Types.ObjectId.createFromHexString(req.body._id);
  Cart.exists({ _id: o_id }).then(async (docs, err) => {
    if (docs) {
      // if exists
      if (req.body.quantity == 1) {
        await Cart.findByIdAndUpdate(o_id, { $inc: { quantity: 1 } }).then(
          (docs, err) => {
            if (docs) {
              res.json({ message: "success" });
            } else {
              res.json({ message: err });
            }
          }
        );
        return;
      }
      await Cart.findByIdAndUpdate(o_id, {
        $inc: { quantity: req.body.quantity },
      }).then((docs, err) => {
        if (docs) {
          res.json({ message: "success" });
        } else {
          res.json({ message: err });
        }
      });
    } else {
      // if not exists
      req.body._id = new mongoose.Types.ObjectId.createFromHexString(
        req.body._id
      );
      await Cart.insertMany(req.body).then((docs, err) => {
        if (docs) {
          res.json({ message: "success" });
        } else {
          res.json({ message: err });
        }
      });
    }
  });
});
cartRouter.put("/product/quantity", async (req, res) => {
  let query = new mongoose.Types.ObjectId.createFromHexString(req.body._id);
  let updatevalue = { $set: { quantity: req.body.quantity } };
  await Cart.findByIdAndUpdate(query, updatevalue).then((docs, err) => {
    if (docs) {
      res.send({ success: true, data: docs });
    } else {
      res.send({ success: false, data: err });
    }
  });
});

cartRouter.delete("", async (req, res) => {
  var o_id = new mongoose.Types.ObjectId.createFromHexString(req.body._id);
  await Cart.findByIdAndDelete(o_id).then((docs, err) => {
    if (docs) {
      res.json({ message: "success" });
    } else {
      res.json({ message: err });
    }
  });
});
cartRouter.patch("", async (req, res) => {
  await Cart.remove({}).then((docs, err) => {
    if (docs) {
      res.json({ message: "success" });
    } else {
      res.json({ message: err });
    }
  });
});
*/
module.exports = cartRouter;
