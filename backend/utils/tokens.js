const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
}

const generateRefreshToken = (user, sessionId) => {
    return jwt.sign(
        { id: user._id, sid: sessionId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
}