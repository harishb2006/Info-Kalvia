import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "kalvia_secret_key");
        req.user = decoded; // Attach user info to request (e.g., id)
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token." });
    }
};

export default authMiddleware;
