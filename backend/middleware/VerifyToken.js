import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Token missing, please login again" });
        }

        // Verify the token
        const decodedInfo = jwt.verify(token, process.env.JWT_SECRET);

        if (decodedInfo && decodedInfo.id && decodedInfo.email) {
            req.user = decodedInfo; // Attach user info to request
            return next();
        } else {
            return res.status(401).json({ message: "Invalid token, please login again" });
        }

    } catch (error) {
        console.error("Token verification error:", error);

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token expired, please login again" });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token, please login again" });
        } else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};
