const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  permission_name: {
    type: String,
    required: true,
  },
  is_default: {
    type: Number,
    default: 0, //0-> not default, 1-> deafult
  },
});

module.exports = mongoose.model("Permissions", permissionSchema);
