const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    refresh_token: {
      type: String,
    },
    role: {
      type: Number,
      default: 0, //0-> Normal User, 1-> Admin, 2-> Sub Admin, 3-> Editor
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
