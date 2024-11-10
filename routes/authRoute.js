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
  accountCreate,
  transferFunds,
} = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");
const { getUserPermissions } = require("../controllers/authController");

router.post("/register", registrationValidator, registerUser);
router.post("/login", loginValidator, loginUser);

//authenticated route
router.get("/profile", verifyToken, getProfile);
router.get("/refresh-permissions", verifyToken, getUserPermissions);
router.post("/refresh-access-token", verifyToken, refreshAccessToken);

// account route
router.post("/create-account", accountCreate);
router.post("/transfer-funds", transferFunds);

module.exports = router;
