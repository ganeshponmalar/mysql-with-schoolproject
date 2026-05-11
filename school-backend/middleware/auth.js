const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // Try retrieving from cookies first, fallback to Header
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token provided, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

const allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: insufficient permissions" });
        }
        next();
    };
};

module.exports = { verifyToken, allowRoles };
