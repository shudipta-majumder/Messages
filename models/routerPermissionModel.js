const mongoose = require("mongoose");

const routerPermissionSchema = new mongoose.Schema({
  router_endpoint: {
    type: String,
    required: true,
  },
  role: {
    type: Number, //0,1,2,3
    default: 0,
  },
  permission_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Permissions",
  },
  permission: {
    type: Array, //0,1,2,3
    required: true,
  },
});

module.exports = mongoose.model("RouterPermissions", routerPermissionSchema);
