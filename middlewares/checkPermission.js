const helper = require("../helpers/helper");

const checkPermission = async (req, res, next) => {
  try {
    if (req.user.userData.role != 1) {
      const routerPermission = await helper.getRouterPermission(
        req.path,
        req.user.userData.role
      );
      const userPermissions = await helper.getUserPermissions(
        req.user.userData._id
      );

      // console.log("routerPermission", routerPermission)
      console.log("userPermissions", userPermissions.permissions.permissions);

      if (
        userPermissions.permissions.permissions == undefined ||
        !routerPermission
      ) {
        return res.status(400).json({
          success: false,
          msg: "You have not permission to access this route",
        });
      }

      const permission_name = routerPermission.permission_id.permission_name;
      const permission_values = routerPermission.permission;
      console.log("router permission_name", permission_name);
      console.log("router permission_values", permission_values);

      const hasPermission = userPermissions.permissions.permissions.some(
        (permission) =>
          permission.permission_name == permission_name &&
          permission.permission_value.some((value) =>
            permission_values.includes(value)
          )
      );
      console.log("hasPermission", hasPermission);

      if (!hasPermission) {
        return res.status(400).json({
          success: false,
          msg: "You have no permission to access this route",
        });
      }
      // return next();
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Something went wrongs",
    });
  }
  next();
};

module.exports = checkPermission;
