const { check } = require("express-validator");

exports.permissionAddValidator = [
  check("permission_name", "permission_name is required").not().isEmpty(),
];

exports.permissionDeleteValidator = [
  check("id", "id is required").not().isEmpty(),
];

exports.permissionUpdateValidator = [
  check("id", "ID is required").not().isEmpty(),
  check("permission_name", "permission_name is required").not().isEmpty(),
];

exports.categoryAddValidator = [
  check("category_name", "category_name is required").not().isEmpty(),
];

exports.categoryDeleteValidator = [
  check("id", "ID is required").not().isEmpty(),
];

exports.categoryUpdateValidator = [
  check("id", "ID is required").not().isEmpty(),
  check("category_name", "category_name is required").not().isEmpty(),
];

exports.postCreateValidator = [
  check("title", "title is required").not().isEmpty(),
  check("description", "description is required").not().isEmpty(),
];

exports.postDeleteValidator = [check("id", "ID is required").not().isEmpty()];

exports.postUpdateValidator = [
  check("id", "ID is required").not().isEmpty(),
  check("title", "title is required").not().isEmpty(),
  check("description", "description is required").not().isEmpty(),
];

exports.addRoleValidator = [
  check("role_name", "role_name is required").not().isEmpty(),
  check("value", "value is required").not().isEmpty(),
];

exports.postLikeValidator = [
  check("user_id", "user_id is required").not().isEmpty(),
  check("post_id", "post_id is required").not().isEmpty(),
];

exports.postUnlikeValidator = [
  check("user_id", "user_id is required").not().isEmpty(),
  check("post_id", "post_id is required").not().isEmpty(),
];

exports.postLikeCountValidator = [
  check("post_id", "post_id is required").not().isEmpty(),
];

exports.addRouterPermissionValidator = [
  check("router_endpoint", "router_endpoint is required").not().isEmpty(),
  check("role", "role is required").not().isEmpty(),
  check("permission_id", "permission_id is required").not().isEmpty(),
  check("permission", "permission must be an array").isArray(),
];

exports.getRouterPermissionValidator = [
  check("router_endpoint", "router_endpoint is required").not().isEmpty(),
];

exports.deleteUserValidator = [check("id", "ID is required").not().isEmpty()];
