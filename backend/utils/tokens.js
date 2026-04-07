const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "20s" }
    );
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
}

const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
}