const express = require("express");
const router = express();

const {
  registrationValidator,
  loginValidator,
} = require("../helpers/validator");
const {
  registerUser,
  loginUser,
  getProfile,
  refreshAccessToken,
} = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");
const { getUserPermissions } = require("../controllers/authController");

router.post("/register", registrationValidator, registerUser);
router.post("/login", loginValidator, loginUser);

//authenticated route
router.get("/profile", verifyToken, getProfile);
router.get("/refresh-permissions", verifyToken, getUserPermissions);
router.post("/refresh-access-token", verifyToken, refreshAccessToken);

module.exports = router;
