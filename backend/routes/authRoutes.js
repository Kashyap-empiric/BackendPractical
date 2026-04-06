const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")
const User = require("../models/User");
const { generateAccessToken } = require("../utils/tokens");

router.post("/register", register);
router.post("/login", login);

router.get("/dashboard", authMiddleware, (req, res) => {
    res.json({
        message: "Welcome to dashboard",
        user: req.user
    });
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });
  const user = await User.findOne({ refreshToken });
  if (!user)
    return res.status(403).json({ message: "Invalid refresh token" });
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Invalid token" });
      const newAccessToken = generateAccessToken(user._id);
      res.json({ accessToken: newAccessToken });
    }
  );
});

router.post("/logout", async (req, res) => {
    const { refreshToken } = req.body;
    const user = await User.findOne({ refreshToken });
    if(user) {
        user.refreshToken = null;
        await user.save();
    }
    res.json({ message: "Logged out successfully" });
});


module.exports = router;