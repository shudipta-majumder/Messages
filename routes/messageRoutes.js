const express = require("express");
const router = express.Router();
const {
  getMessages,
  sendMessage,
  getUsers,
} = require("../controllers/messageController.js");
const verifyToken = require("../middlewares/authMiddleware");

router.get("/:id", verifyToken, getMessages);
router.post("/send/:id", verifyToken, sendMessage);

router.get("/conversations/users", verifyToken, getUsers);

module.exports = router;
