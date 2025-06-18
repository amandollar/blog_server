import jwt from 'jsonwebtoken';

/**
 * Verifies a JWT token and returns the decoded payload
 * @param {string} token - The JWT token
 * @returns {object} - Decoded token payload (e.g., { id, email })
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error("Invalid token");
    }
};
