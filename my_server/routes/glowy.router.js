const express = require("express");
const router = express.Router();

const Admin = require("../models/Admin");
const crypto = require("crypto");

//get admin
router.get("/admin", async (req, res) => {
  Admin.find({})
    .then((admin) => {
      res.json(admin);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});

router.post("/login-admin", (req, res) => {
  var adminInfo = req.body;
  // Anywhere a callback is passed to a query in Mongoose, the callback follows the pattern callback(error, results). What results is depends on the operation: For findOne() it is a potentially-null single document, find() a list of documents, count() the number of documents, update() the number of documents affected, etc. The API docs for Models provide more detail on what is passed to the callbacks.
  Admin.findOne({ email: adminInfo.email }, function (err, data) {
    if (err) {
      res.json({ message: "fail" });
      return;
    }
    let salt = data.salt;
    let hash = crypto
      .pbkdf2Sync(adminInfo.pass, salt, 1000, 64, `sha512`)
      .toString(`hex`);
    if (data.pass == hash) {
      req.session.isAdmin = true;
      res.send({ message: "success" });
    } else {
      res.json({ message: "unsuccess" });
    }
  });
});

router.post("/signout-admin", (req, res) => {
  req.session.isAdmin = undefined;
  res.send(req.session);
});

// Check if user is logged in as admin
router.get("/check-admin", (req, res) => {
  if (req.session.isAdmin == undefined) {
    res.send("Unauthorized").status(401);
  } else {
    res.send("Authorized").status(200);
  }
});

router.get("", (req, res) => {
  res.status(200).send("Hello from glowy");
});

router.get("/session", (req, res) => {
  req.session.test = "test";
  res.send(req.session);
});

module.exports = router;
