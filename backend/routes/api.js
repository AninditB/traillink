const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// Import Controllers
const { registerUser } = require("../controllers/registerUser");
const { loginUser, logoutUser } = require("../controllers/loginUser");
const { createPost,joinPost, getPosts, deletePost, leavePost } = require("../controllers/postController");
const {  getGroups } = require("../controllers/groupController");

// ✅ Test Route
router.get("/ping", (req, res) => {
  res.json({ message: "Pong!" });
});

// ✅ User Authentication Routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// ✅ Post Routes
router.post("/posts/createPost", authMiddleware, createPost); // Create post
router.get("/posts/listPosts", getPosts); // Get all posts
router.delete("/posts/delete/:postId", authMiddleware, deletePost); // Delete post
router.post("/posts/leave/:postId", authMiddleware, leavePost); // Leave post
router.post("/posts/join/:postId", authMiddleware, joinPost); // Join a post


router.get("/groups/listGroups", getGroups); // Get all groups

module.exports = router;

