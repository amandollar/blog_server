import jwt from 'jsonwebtoken';  
import User from '../models/User.js';

export const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findById(decoded.id);
        return user;
    } catch (error) {
        throw new Error("Invalid token");
    }
};
