const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const {
  categoryAddValidator,
  categoryDeleteValidator,
  categoryUpdateValidator,
  postDeleteValidator,
  postCreateValidator,
  postUpdateValidator,
  deleteUserValidator,
  postLikeValidator,
  postUnlikeValidator,
  postLikeCountValidator,
} = require("../helpers/adminValidator");
const {
  addCategories,
  getCategories,
  deleteCategories,
  updateCategories,
} = require("../controllers/categoryController");
const {
  createPost,
  getPosts,
  deletePost,
  updatePost,
} = require("../controllers/postController");
const { createUserValidator, updateUserValidator } = require("../helpers/validator");
const { createUser, getUser, updateUser, delateUser } = require("../controllers/userController");
const { postLike, postUnlike, postLikeCount } = require("../controllers/likeController");
const checkPermission = require("../middlewares/checkPermission");

//category routes
router.post("/add-category", verifyToken, checkPermission, categoryAddValidator, addCategories);
router.get("/get-categories", verifyToken, checkPermission, getCategories);
router.delete("/delete-category",verifyToken, checkPermission, categoryDeleteValidator, deleteCategories);
router.put("/update-category", verifyToken, checkPermission, categoryUpdateValidator, updateCategories);

//Like routes
router.post("/post-like", verifyToken, checkPermission, postLikeValidator, postLike);
router.post("/post-unlike", verifyToken, checkPermission, postUnlikeValidator, postUnlike);
router.post("/post-like-count", verifyToken, checkPermission,  postLikeCountValidator, postLikeCount);

//post routes
router.post("/create-post", verifyToken, checkPermission, postCreateValidator, createPost);
router.get("/get-posts", verifyToken, checkPermission, getPosts);
router.delete("/delete-post", verifyToken, checkPermission, postDeleteValidator, deletePost);
router.put("/update-post", verifyToken, checkPermission, postUpdateValidator, updatePost);

//users route
router.post("/create-user", verifyToken, createUserValidator, createUser);
router.get("/get-users", verifyToken, getUser);
router.put("/update-user", verifyToken, updateUserValidator, updateUser);
router.delete("/delete-user", verifyToken, deleteUserValidator, delateUser);

module.exports = router;
