import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "kalvia_secret_key";

const authMiddleware = (req, res, next) => {
    // Check Authorization header first (for cross-origin compatibility)
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else {
        // Fallback to cookie for backward compatibility
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

export default authMiddleware;
