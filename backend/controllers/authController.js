import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateOTP from "../utils/GenerateOtp.js";
import { sendEmail } from "../utils/Emails.js";
import { templateEmail } from "../utils/templateEmail.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import sanitizeUser from "../utils/SanitizeUser.js";
import Otp from "../models/Otp.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/GenerateToken.js";
import PasswordResetToken from "../models/PasswordResetToken.js";

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists with this email" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();

        // Generate and save OTP
        const otpCode = generateOTP();
        const hashedOtp = await bcrypt.hash(otpCode, salt);

        const newOtp = new Otp({
            user: user._id,
            otp: hashedOtp,
            expireAt: Date.now() + Number(process.env.OTP_EXPIRATION_TIME)
        });
        await newOtp.save();

        // Send OTP email
        await sendEmail(user.email, "Your OTP Code", templateEmail(otpCode));

        res.status(201).json(sanitizeUser(user));
    } catch (error) {
        console.error("Error during sign-up:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Find the existing user by email
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the password is valid
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate token and set it in cookies
        const token = generateToken(existingUser, res);

        // Send response with sanitized user and token
        res.status(200).json({
            user: sanitizeUser(existingUser),
            token
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        // Check if user exists
        const isValidUserId = await User.findById(userId);
        if (!isValidUserId) {
            return res.status(404).json({ message: 'User not found, for which the OTP was generated' });
        }

        // Check if OTP exists for the user
        const isOtpExisting = await Otp.findOne({ user: isValidUserId._id });
        if (!isOtpExisting) {
            return res.status(404).json({ message: 'OTP not found for this user' });
        }

        // Check if OTP is expired
        if (isOtpExisting.expireAt < Date.now()) {
            await Otp.findByIdAndDelete(isOtpExisting._id);
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Validate OTP and update user's verified status
        const isOtpValid = await bcrypt.compare(otp, isOtpExisting.otp);
        if (isOtpValid) {
            await Otp.findByIdAndDelete(isOtpExisting._id); // Delete the OTP after successful verification
            const verifiedUser = await User.findByIdAndUpdate(
                isValidUserId._id,
                { isVerified: true },
                { new: true }
            );
            return res.status(200).json(sanitizeUser(verifiedUser));
        }

        // If OTP doesn't match, return invalid OTP message
        return res.status(400).json({ message: 'Invalid OTP' });

    } catch (error) {
        console.error("Error during OTP verification:", error);
        res.status(500).json({ message: "An error occurred while verifying OTP" });
    }
};

export const forgotPassword = async (req, res) => {
    let newTokenDoc;

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const isExistingUser = await User.findOne({ email });

        if (!isExistingUser) {
            return res.status(404).json({ message: "Provided email does not exist" });
        }

        // Generate password reset token using JWT
        const passwordResetToken = jwt.sign(
            { id: isExistingUser._id, email: isExistingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION_TIME } // e.g., "15m"
        );

        const hashedToken = await bcrypt.hash(passwordResetToken, 10);

        // Optional: remove previous reset tokens for the user
        await PasswordResetToken.deleteMany({ user: isExistingUser._id });

        // Save hashed token to DB
        newTokenDoc = new PasswordResetToken({
            user: isExistingUser._id,
            token: hashedToken,
            expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
        });

        await newTokenDoc.save();

        // Send email with reset link
        const resetLink = `${process.env.ORIGIN}/reset-password/${isExistingUser._id}/${passwordResetToken}`;

        const emailBody = `
            <p>Dear ${isExistingUser.name},</p>
            <p>We received a request to reset your password. If you initiated this request, click below:</p>
            <p><a href="${resetLink}" target="_blank">Reset Password</a></p>
            <p>This link is valid for a limited time. If you did not request a password reset, please ignore this email.</p>
            <p>Thank you,<br/>The MERN-AUTH-REDUX-TOOLKIT Team</p>
        `;

        await sendEmail(
            isExistingUser.email,
            "Password Reset - MERN-AUTH-REDUX-TOOLKIT",
            emailBody
        );

        res.status(200).json({ message: `Password reset link sent to ${isExistingUser.email}` });

    } catch (error) {
        console.error("Forgot password error:", error);

        // Cleanup if error occurs after token is saved
        if (newTokenDoc) {
            await PasswordResetToken.findByIdAndDelete(newTokenDoc._id);
        }

        res.status(500).json({ message: "Error occurred while processing password reset" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { userId, token, password } = req.body;

        if (!userId || !token || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user exists
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Find reset token
        const resetTokenDoc = await PasswordResetToken.findOne({ user: userId });
        if (!resetTokenDoc) {
            return res.status(404).json({ message: "Reset link is not valid" });
        }

        // Check if token has expired
        if (resetTokenDoc.expiresAt < Date.now()) {
            await PasswordResetToken.findByIdAndDelete(resetTokenDoc._id);
            return res.status(400).json({ message: "Reset link has expired" });
        }

        // Validate token
        const isTokenValid = await bcrypt.compare(token, resetTokenDoc.token);
        if (!isTokenValid) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        existingUser.password = hashedPassword;
        await existingUser.save();

        // Clean up reset token
        await PasswordResetToken.findByIdAndDelete(resetTokenDoc._id);

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Error occurred while resetting the password" });
    }
};

export const logOut = async (req, res) => {
    try {
        // Clear the token from cookies
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Error occurred while logging out" });
    }
};


export const checkAuth = async (req, res) => {
    try {
        if (req.user) {
            return res.status(200).json({ user: req.user });
        } else {
            return res.sendStatus(401); // Unauthorized
        }
    } catch (error) {
        console.error("Error checking auth:", error);
        return res.sendStatus(500); // Internal Server Error
    }
};
