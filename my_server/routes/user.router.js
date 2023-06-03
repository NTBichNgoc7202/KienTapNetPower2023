const express = require("express");
const userRouter = express.Router();
const md5 = require("md5");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const crypto = require("node:crypto");
const fs = require("fs");

const User = require("../models/User");

// get user
userRouter.get("", async (req, res) => {
  User.find({})
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});

// Get Single User By Phone
userRouter.get("/phone/:phone", async (req, res) => {
  User.findOne({ phone: req.params.phone })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});
//Update
// salt = crypto.randomBytes(16).toString("hex"); // create salt
// hash = crypto
//   .pbkdf2Sync("Daica2002", salt, 1000, 64, 'sha512')
//   .toString('hex');
//   console.log(salt);
// console.log(hash);


userRouter.put("", async (req, res) => {
  User.findByIdAndUpdate(req.body._id, {
    $set: {
      username: req.body.username,
      phone: req.body.phone,
      useremail: req.body.useremail,
      address: req.body.address,
    },
  }).then((docs, err) => {
    if (docs) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });
});
// Check if user is logged in
userRouter.get("/isLoggedIn", async (req, res) => {
  if (req.session.unique_id == undefined) {
    res.json({ message: "Unauthorized" }).status(401);
  } else {
    User.findOne({ unique_id: req.session.unique_id }).then((data, err) => {
      if (data) {
        res.json({ message: "Authorized", user: data });
      } else {
        res.json({ message: "Unauthorized" }).status(401);
      }
    });
  }
});

// Logout user
userRouter.post("/logout", async (req, res) => {
  req.session.unique_id = undefined;
  req.session.save();
  res.send(req.session);
});

// register user
userRouter.post("/regis", async (req, res) => {
  var userInfo = req.body;
  if (userInfo.image === "") {
    let path_to_default_image = appRoot + "/resources/default_avatar.txt";
    userInfo.image = fs.readFileSync(path_to_default_image, "utf8");
  }
  await User.findOne({ phone: userInfo.phone }).then((data, err) => {
    if (data) {
      res.send({ message: "phone exists" });
    } else {
      salt = crypto.randomBytes(16).toString("hex");
      hash = crypto
        .pbkdf2Sync(userInfo.pass, salt, 1000, 64, `sha512`)
        .toString(`hex`);
      userInfo.pass = hash;
      userInfo.salt = salt;
      userInfo.unique_id = uuidv4();
      User.insertMany(userInfo).then((docs, err) => {
        if (docs) {
          res.send({ message: "success" });
        } else {
          res.send({ message: err });
        }
      });
    }
  });
});
userRouter.get("/loginCookie", (req, res) => {
  if (req.cookies.userPhone != undefined && req.cookies.userPass != undefined) {
    // if cookie exists
    let phone = req.cookies.userPhone;
    let pass = req.cookies.userPass;
    res.json({ phone: phone, pass: pass });
  } else {
    res.json({ message: "fail" });
  }
});

// login user
userRouter.post("/login", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4300");
  res.setHeader("Access-Control-Allow-Credentials", true);

  var userInfo = req.body;
  User.findOne({ phone: userInfo.phone }).then((data, err) => {
    if (data) {
      let salt = data.salt;
      let hash = crypto
        .pbkdf2Sync(userInfo.pass, salt, 1000, 64, `sha512`)
        .toString(`hex`);
      if (data.pass == hash) {
        if (
          req.cookies.userPhone == undefined &&
          req.cookies.userPass == undefined
        ) {
          // if cookie doesn't exist
          res.cookie("userPhone", userInfo.phone, {
            maxAge: 900000,
            httpOnly: false,
          });
          res.cookie("userPass", userInfo.pass, {
            maxAge: 900000,
            httpOnly: false,
          });
        }
        req.session.unique_id = data.unique_id;
        req.session.save();
        res.json({ message: "success", user: data });
      } else {
        res.json({ message: "unsuccess" });
      }
    } else {
      res.json({ message: "fail" });
    }
  });
});
// delete user
userRouter.delete("", async (req, res) => {
  User.findByIdAndDelete(req.body._id).then((docs, err) => {
    if (docs) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });
});

//Get new password
userRouter.post("/Fgpw", async (req, res) => {
  var userInfo = req.body;
  let salt = crypto.randomBytes(16).toString("hex");
  let hash = crypto
    .pbkdf2Sync("12345678", salt, 1000, 64, `sha512`)
    .toString(`hex`);
  User.findOneAndUpdate(
    { phone: userInfo.phone },
    { pass: hash, salt: salt },
    function (err, data) {
      if (data) {
        res.json({ message: "success", newPassword: "12345678" });
      } else {
        res.json({ message: err });
      }
    }
  );
});
userRouter.put("/Fgpw", async (req, res) => {
  var newPass = req.body.newPass;
  var oldPass = req.body.oldPass;
  User.findOne({ phone: req.body.phone }).then((data, err) => {
    let salt = data.salt;
    let hash = crypto
      .pbkdf2Sync(oldPass, salt, 1000, 64, `sha512`)
      .toString(`hex`);
    if (data.pass == hash) {
      let newSalt = crypto.randomBytes(16).toString("hex");
      let newHash = crypto
        .pbkdf2Sync(newPass, newSalt, 1000, 64, `sha512`)
        .toString(`hex`);
      User.findOneAndUpdate(
        { phone: req.body.phone },
        { pass: newHash, salt: newSalt },
        function (err, data) {
          if (data) {
            res.json({ message: "success" });
          } else {
            res.json({ message: err });
          }
        }
      );
    }
  });
});

// get user by id
userRouter.get("/:id", async (req, res) => {
  let o_id = new mongoose.Types.ObjectId.createFromHexString(req.params.id);
  User.findById(o_id)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});

module.exports = userRouter;
