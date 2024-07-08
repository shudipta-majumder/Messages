const User = require("../models/userModel");
const RouterPermission = require("../models/routerPermissionModel");
const mongoose = require("mongoose");

const getUserPermissions = async (user_id) => {
  try {
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(user_id),
        },
      },
      {
        $lookup: {
          from: "userpermissions",
          localField: "_id",
          foreignField: "user_id",
          as: "permissions",
        },
      },
      {
        $project: {
          _id: 1,
          role: 1,
          permissions: {
            $cond: {
              if: {
                $isArray: "$permissions",
              },
              then: { $arrayElemAt: ["$permissions", 0] },
              else: null,
            },
          },
        },
      },
      {
        $addFields: {
          permissions: {
            permissions: "$permissions.permissions",
          },
        },
      },
    ]);
    return user[0];
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getRouterPermission = async (router, role) => {
  try {
    const routerPermission = await RouterPermission.findOne({
      router_endpoint: router,
      role,
    }).populate('permission_id');
    return routerPermission;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

module.exports = {
  getUserPermissions,
  getRouterPermission,
};
