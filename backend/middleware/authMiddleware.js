const jwt = require("jsonwebtoken");
const Session = require("../models/Session");

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: "Access token missing/not provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const session = await Session.findById(decoded.sid);
        if(!session) {
            return res.status(401).json({ message: "Session revoked"})
        }
        req.userId = decoded.id;
        req.sessionId = decoded.sid || null;
        next();
    } catch (err) {
        if(err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Access token expired" });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid access token" });
        }
        return res.status(500).json({
            message: "Authentication error"
        });
    }
}

module.exports = authMiddleware;