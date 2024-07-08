const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Categories',
    require: false,
  }],
});

module.exports = mongoose.model("Post", postSchema);
