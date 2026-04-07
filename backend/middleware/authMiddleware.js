const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: "Access token missing/not provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if(err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Access token expired" });
        }
        res.status(401).json({ message: "Invalid access token" });
    }
}

module.exports = authMiddleware;