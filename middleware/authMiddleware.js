import { verifyToken } from "../utils/jwtUtils.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token); 

        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message || "Unauthorized" });
    }
};

export default authMiddleware;
