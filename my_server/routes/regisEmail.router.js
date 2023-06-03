const express = require("express");
const regisEmailRouter = express.Router();
const md5 = require("md5");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const RegisEmail = require("../models/RegisEmail");

//get email
regisEmailRouter.get("", async (req, res) => {
  RegisEmail.find({})
    .then((regisEmail) => {
      res.json(regisEmail);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});
//post email
regisEmailRouter.post("", async (req, res, next) => {
  var userInfo = req.body;
  if (!userInfo.useremail) {
    res.send();
  } else {
    RegisEmail.findOne({ useremail: userInfo.useremail }, function (err, data) {
      if (!data) {
        var c;
        RegisEmail.findOne({}, function (err, data) {
          if (data) {
            c = data.unique_id + 1;
          } else {
            c = 1;
          }
          var newEmail = new RegisEmail({
            unique_id: c,
            useremail: userInfo.useremail,
          });


        })
          .sort({ _id: -1 })
          .limit(1);
        res.json({ message: "success" });
      } else {
        res.json({ message: "fail" });
      }
    });
  }
});

module.exports = regisEmailRouter;
