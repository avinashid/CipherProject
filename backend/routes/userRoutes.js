const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  userData,
  updateUserData,
  getUserData,
} = require("../controllers/userController.js");


const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/userdata", protect, userData);
router.put("/updateuserdata/:userId",protect, updateUserData);
router.get("/getuserdata/:userId", protect, getUserData);

module.exports = router;
