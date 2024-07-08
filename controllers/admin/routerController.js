const { validationResult } = require("express-validator");
const RouterPermission = require("../../models/routerPermissionModel");

const getAllRoutes = async (req, res) => {
  try {
    const routes = [];
    const stack = req.app._router.stack;
    stack.forEach((data) => {
      if (data.name == "router" && data.handle.stack) {
        data.handle.stack.forEach((handler) => {
          routes.push({
            path: handler.route.path,
            mathods: handler.route.methods,
          });
        });
      }
    });
    return res.status(200).json({
      success: true,
      msg: "All Routes",
      data: routes,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const addRouterPermission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { router_endpoint, role, permission_id, permission } = req.body;
    const routerPermission = await RouterPermission.findOneAndUpdate(
      { router_endpoint, role },
      { router_endpoint, role, permission_id, permission },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({
      success: true,
      msg: "Router Permission Added/Updated",
      data: routerPermission,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getRouterPermissions = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { router_endpoint } = req.body;
    const routerPermissions = await RouterPermission.find({
      router_endpoint
    }).populate('permission_id');
    return res.status(200).json({
      success: true,
      msg: "Router Permissions",
      data: routerPermissions,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getAllRoutes,
  addRouterPermission,
  getRouterPermissions,
};
