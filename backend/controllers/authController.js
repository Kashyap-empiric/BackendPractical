require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const UAParser = require("ua-parser-js");
const Session = require("../models/Session");
const authService = require("../services/authService");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokens");
const { accessCookieOptions, refreshCookieOptions, deviceTokenOptions } = require("../utils/cookieOptions");

exports.register = async (req, res) => {
    try {
        await authService.registerUser(req.body);
        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const mongoose = require("mongoose");

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid email" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const sessionId = new mongoose.Types.ObjectId();

    const accessToken = generateAccessToken(user, sessionId);
    const refreshToken = generateRefreshToken(user, sessionId);

    const refreshHash = await bcrypt.hash(refreshToken, 10);

    let deviceToken = req.cookies.device_token;

    const parser = new UAParser(req.headers["user-agent"]);
    const userAgentParsed = parser.getResult();

    if(!deviceToken) {
        deviceToken = crypto.randomUUID();
        res.cookie("device_token", deviceToken, deviceTokenOptions)
    }

    await Session.create({
        _id: sessionId,
        user: user._id,
        refreshToken: refreshHash,
        deviceInfo: {
            deviceId: deviceToken,
            userAgent: userAgentParsed,
            ipAddress: req.ip,
            lastUsed: new Date()
        },
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.json({
        message: "Login successful",
        user: {
            name: user.name,
            email: user.email
        }
    });
};

exports.refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const session = await Session.findById(decoded.sid);
    if (!session) {
        return res.status(403).json({ message: "Invalid session" });
    }

    const match = await bcrypt.compare(token, session.refreshToken);
    if (!match) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    const newAccessToken = generateAccessToken(user, session._id);

    session.deviceInfo.lastUsed = new Date();
    await session.save();

    res.cookie("accessToken", newAccessToken, accessTokenOptions);
    res.json({ message: "Access Token refreshed" });
}

exports.logoutSession = async (req, res) => {
    const { sessionId } = req.params;
    await Session.deleteOne({ _id: sessionId, user: req.userId });
    res.json({ message: "Session logged out" });
}

exports.logout = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
            await Session.deleteOne({ _id: decoded.sid, user: req.userId });
        } catch { }
    }
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    res.json({ message: "Logged out successfully" })
}

exports.logoutAll = async (req, res) => {
    await Session.deleteMany({ user: req.userId });
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    res.json({ message: "All sessions revoked" })
}

exports.getSessions = async (req, res) => {
    const sessions = await Session.find({ user: req.userId }).lean();

    const refreshToken = req.cookies.refreshToken;

    let currentSid = null;
    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            currentSid = decoded.sid;
        } catch { }
    }

    const result = sessions.map(s => ({ ...s, current: s._id.toString() === currentSid }));

    res.json({ sessions: result })
}