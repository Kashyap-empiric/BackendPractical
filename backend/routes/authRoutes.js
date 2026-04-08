const express = require("express");
const router = express.Router();
const { register, login, refreshToken, logoutAll, getSessions, logout, logoutSession } = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")
const User = require("../models/User");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);

router.post("/logout", authMiddleware, logout);
router.get("/sessions", authMiddleware, getSessions);
router.post("/logout-all", authMiddleware, logoutAll);

router.get("/authcheck", authMiddleware, (req, res) => {
    res.json({ message: "You are authenticated", user: req.userId });
});

router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to dashboard",
    user: req.userId
  });
});

router.delete("/sessions/:sessionId", authMiddleware, logoutSession);

module.exports = router;