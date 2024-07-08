const { validationResult } = require("express-validator");
const Post = require("../models/postModel");

const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { title, description } = req.body;

    var obj = {
      title,
      description,
    };

    if (req.body.categories) {
      obj.categories = req.body.categories;
    }

    const post = new Post(obj);
    const postData = await post.save();

    const postFullData = await Post.findOne({
      _id: postData._id,
    }).populate("categories");

    return res.status(200).json({
      success: true,
      msg: "Post Added Successfuly",
      data: postFullData,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getPosts = async (req, res) => {
  try {
    const Posts = await Post.find({}).populate("categories");
    return res.status(200).json({
      success: true,
      msg: "Posts Fetched Successfully!",
      data: Posts,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }
    const { id } = req.body;
    const isExists = await Post.findOne({ _id: id });

    if (!isExists) {
      return res.status(400).json({
        success: false,
        msg: "Posts ID doesn not exists",
      });
    }

    await Post.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      success: true,
      msg: "Posts Deleted Successfully!",
    });
  } catch (error) {
    res.status(500).send("Post does not exists");
  }
};

const updatePost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { id, title, description } = req.body;

    var updateObj = {
      title,
      description,
    };

    if (req.body.categories) {
      updateObj.categories = req.body.categories;
    }
    const updatedData = await Post.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateObj,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Post Updated Successfuly",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).send("Post does not exists");
  }
};

module.exports = {
  createPost,
  getPosts,
  deletePost,
  updatePost,
};
