import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
    try {
        const authorizeHeader = req.headers["authorization"];

        if (!authorizeHeader) {
            throw { status: 401, message: "Authorization header is missing" };
        }

        const tokenValue = authorizeHeader;
        try {
            const data = jwt.verify(tokenValue, process.env.JWT_PRIVATE);
            req.userData = data;
            next();
        } catch (err) {
            throw { status: 401, message: "Invalid or expired token" }; // 401 Unauthorized for invalid token
        }
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || "Something went wrong" });
    }
};
