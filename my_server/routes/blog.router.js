const express = require("express");
const blogRouter = express.Router();
const md5 = require("md5");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const Blog = require("../models/Blog");

// get blog
blogRouter.get("", async (req, res) => {
  Blog.find({})
    .then((blogs) => {
      res.json(blogs);
    })
    .catch((err) => {
      res.json({ Error: err.message });
    });
});

blogRouter.get("/:id", async (req, res) => {
  var o_id = new mongoose.Types.ObjectId.createFromHexString(req.params["id"]);
  // var o_id = new mongoose.Types.ObjectId.createFromTime(req.params["id"]);
  try {
    let blog = await Blog.findById(o_id);
    res.json(blog);
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = blogRouter;