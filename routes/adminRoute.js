const express = require("express");
const router = express();

const {
  permissionAddValidator,
  permissionDeleteValidator,
  permissionUpdateValidator,
  addRoleValidator,
  addRouterPermissionValidator,
  getRouterPermissionValidator,
} = require("../helpers/adminValidator");
const {
  addPermission,
  getPermissions,
  deletePermission,
  updatePermission,
} = require("../controllers/admin/permissionController");
const verifyToken = require("../middlewares/authMiddleware");
const { onlyAdminAccess } = require("../middlewares/adminMiddleware");
const { getRoles, addRole } = require("../controllers/admin/roleController");
const { addRouterPermission, getRouterPermissions } = require("../controllers/admin/routerController");

//permission routes
router.post(
  "/add-permission",
  verifyToken,
  onlyAdminAccess,
  permissionAddValidator,
  addPermission
);
router.get("/get-permissions", verifyToken, onlyAdminAccess, getPermissions);
router.delete(
  "/delete-permission",
  verifyToken,
  onlyAdminAccess,
  permissionDeleteValidator,
  deletePermission
);
router.put(
  "/update-permission",
  verifyToken,
  onlyAdminAccess,
  permissionUpdateValidator,
  updatePermission
);

//role route
router.post(
  "/add-role",
  verifyToken,
  onlyAdminAccess,
  addRoleValidator,
  addRole
);
router.get("/get-roles", verifyToken, onlyAdminAccess, getRoles);

//router permission routes
router.post("/add-router-permission", verifyToken, onlyAdminAccess, addRouterPermissionValidator, addRouterPermission);
router.get("/get-router-permissions", verifyToken, onlyAdminAccess, getRouterPermissionValidator, getRouterPermissions);

module.exports = router;
