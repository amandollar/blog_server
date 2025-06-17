import { verifyToken } from "../utils/jwtUtils.js";



const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = await verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export default authMiddleware;


