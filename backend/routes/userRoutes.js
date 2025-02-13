const express = require("express");
const {
  login,
  signup,
  logout,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protected } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", protected, logout);
router
  .route("/profile")
  .get(protected, getUserProfile)
  .put(protected, updateUserProfile);

module.exports = router;
