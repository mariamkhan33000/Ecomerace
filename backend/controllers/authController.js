import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateOTP from "../utils/GenerateOtp.js";
import { sendEmail } from "../utils/Emails.js";
import { templateEmail } from "../utils/templateEmail.js";
import sanitizeUser from "../utils/SanitizeUser.js";
import Otp from "../models/Otp.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/GenerateToken.js";

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
