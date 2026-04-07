const express = require("express");
const router = express.Router();
const { register, login, refreshToken, logout } = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")
const User = require("../models/User");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

router.get("/authcheck", authMiddleware, (req, res) => {
    res.json({ message: "You are authenticated", user: req.user });
});

router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to dashboard",
    user: req.user
  });
});


module.exports = router;