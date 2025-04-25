import jwt from 'jsonwebtoken';

export const generateToken = (user, res) => {
    try {
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION_TIME || "1h" } // Default to 1 hour if not provided
        );

        // Setting the token in the response cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only set secure cookies in production
            sameSite: "strict",
            maxAge: Number(process.env.JWT_EXPIRATION_TIME || 3600) * 1000 // Default to 1 hour if not provided
        });

        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Failed to generate authentication token");
    }
};
