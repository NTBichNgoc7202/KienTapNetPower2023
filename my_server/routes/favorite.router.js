const express = require("express");
const favoriteRouter = express.Router();
const md5 = require("md5");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const Favorite = require("../models/Favorite");

favoriteRouter.post("", async (req, res) => {
  if (req.session.unique_id != undefined) {
    let existingFavorite = await Favorite.findOne({
      unique_id: req.session.unique_id,
    });
    if (existingFavorite != null) {
      let productsArray = existingFavorite.products;
      let index = productsArray.findIndex(
        (element) => element._id == req.body._id
      );
      if (index != -1) {
        productsArray[index].quantity += req.body.quantity;
      } else {
        productsArray.push(req.body);
      }
      await Favorite.findOneAndUpdate(
        { unique_id: req.session.unique_id },
        { products: productsArray }
      );
    } else {
      let newFavorite = new Favorite({
        unique_id: req.session.unique_id,
        products: [req.body],
      });
      await Favorite.insertMany(newFavorite);
    }
  }
  if (req.session.guestFavorite == undefined) {
    req.session.guestFavorite = [];
  }
  let index = await req.session.guestFavorite.findIndex(
    (element) => element._id == req.body._id
  );
  if (index != -1) {
    req.session.guestFavorite[index].quantity += req.body.quantity;
    res.json({ message: "success" });
  } else {
    await req.session.guestFavorite.push(req.body);
    res.json({ message: "success" });
  }
});

favoriteRouter.get("", async (req, res) => {
  if (req.session.unique_id != undefined) {
    Favorite.findOne({ unique_id: req.session.unique_id }).then((data, err) => {
      if (data) {
        res.json(data.products);
      } else {
        res.json([]);
      }
    });
  } else {
    res.json(req.session.guestFavorite);
  }
});

favoriteRouter.get("/count", async (req, res) => {
  if (req.session.unique_id != undefined) {
    Favorite.findOne({ unique_id: req.session.unique_id }).then((data, err) => {
      if (data) {
        res.json(data.products.length);
      } else {
        res.json(0);
      }
    });
  } else {
    if (req.session.guestFavorite == undefined) {
      res.json([].length);
    } else {
      res.json(req.session.guestFavorite.length);
    }
  }
});

favoriteRouter.delete("", async (req, res) => {
  if (req.session.unique_id != undefined) {
    await Favorite.findOne({ unique_id: req.session.unique_id }).then(
      async (data, err) => {
        if (data) {
          let productsArray = data.products;
          let index = productsArray.findIndex(
            (element) => element._id == req.body._id
          );
          if (index != -1) {
            productsArray.splice(index, 1);
          }
          await Favorite.findOneAndUpdate(
            { unique_id: req.session.unique_id },
            { products: productsArray }
          );
        }
      }
    );
    res.json({ message: "success" });
  } else {
    let index = req.session.guestFavorite.findIndex(
      (element) => element._id == req.body._id
    );
    if (index != -1) {
      req.session.guestFavorite.splice(index, 1);
      res.json({ message: "success" });
    }
  }
});

favoriteRouter.patch("", async (req, res) => {
  if (req.session.unique_id != undefined) {
    await Favorite.findOne({ unique_id: req.session.unique_id }).then(
      async (data, err) => {
        if (data) {
          await Favorite.findOneAndUpdate(
            { unique_id: req.session.unique_id },
            { products: [] }
          );
        }
      }
    );
    res.json({ message: "success" });
  } else {
    req.session.guestFavorite = [];
    res.json({ message: "success" });
  }
});
module.exports = favoriteRouter;

/*
//get favorite
favoriteRouter.get("", async (req, res) => {
  Favorite.find({})
    .then((favorite) => {
      res.json(favorite);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});

favoriteRouter.get("/count", async (req, res) => {
  Favorite.countDocuments({})
    .then((favoriteCount) => {
      res.json(favoriteCount);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});

favoriteRouter.post("", async (req, res) => {
  var o_id = new mongoose.Types.ObjectId.createFromHexString(req.body._id);
  Favorite.exists({ _id: o_id }).then(async (docs, err) => {
    if (docs) {
      res.send("exists");
    } else {
      await Favorite.insertMany(req.body).then((docs, err) => {
        if (docs) {
          res.json({ message: "success" });
        } else {
          res.json({ message: err });
        }
      });
    }
  });
});

favoriteRouter.delete("", async (req, res) => {
  var o_id = new mongoose.Types.ObjectId.createFromHexString(req.body._id);
  await Favorite.findByIdAndDelete(o_id).then((docs, err) => {
    if (docs) {
      res.json({ message: "success" });
    } else {
      res.json({ message: err });
    }
  });
});
favoriteRouter.patch("", async (req, res) => {
  await Favorite.remove({}).then((docs, err) => {
    if (docs) {
      res.json({ message: "success" });
    } else {
      res.json({ message: err });
    }
  });
});
*/
