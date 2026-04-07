require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authService = require("../services/authService");
const { generateAccessToken } = require("../utils/tokens");
const { accessTokenOptions, refreshCookieOptions } = require("../utils/cookieOptions");

exports.register = async (req, res) => {
    try {
        await authService.registerUser(req.body);
        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await authService.loginUser(req.body);
        res.cookie("accessToken", accessToken, accessTokenOptions);
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);
        res.json({
            message: "Login successful",
            user
        });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
}

exports.refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: "No refresh token" });
        }
        const user = await User.findOne({ refreshToken: token });
        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err) => {
            if (err) {
                return res.status(403).json({ message: "Invalid refresh token" });
            }
            const newAccessToken = generateAccessToken(user);
            res.cookie("accessToken", newAccessToken, accessTokenOptions);
            res.json({ message: "Access Token refreshed" });
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}

exports.logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        const user = await User.findOne({ refreshToken: token });
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}